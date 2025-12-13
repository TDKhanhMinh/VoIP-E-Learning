import { describe, it, expect, vi, beforeEach } from "vitest";
import * as teachingScheduleService from "../../../src/service/teachingScheduleService.js";
import TeachingSchedule from "../../../src/model/teachingSchedule.js";
import User from "../../../src/model/user.js";
import * as enrolledService from "../../../src/service/classStudentService.js";
import * as emailService from "../../../src/service/emailService.js";
import * as classService from "../../../src/service/classService.js";
import * as emailTemplate from "../../../src/utils/emailTemplete.js";
import * as dateFormatter from "../../../src/utils/formatVietnameseDate.js";

// --- 1. SỬ DỤNG vi.hoisted ĐỂ KHẮC PHỤC LỖI HOISTING ---
const mocks = vi.hoisted(() => {
  // Mock chain: find/findById -> populate -> populate -> sort
  const mockSort = vi.fn();
  const mockPopulate = vi.fn(() => ({
    populate: mockPopulate, // Chain populate tiếp
    sort: mockSort, // Hoặc kết thúc bằng sort
  }));

  // Mock start query
  const mockFind = vi.fn(() => ({ populate: mockPopulate }));
  const mockFindById = vi.fn(() => ({ populate: mockPopulate }));
  const mockFindOneAndUpdate = vi.fn();

  return {
    mockSort,
    mockPopulate,
    mockFind,
    mockFindById,
    mockFindOneAndUpdate,
  };
});

// --- 2. Setup Mocks ---

// Mock Models
vi.mock("../../../src/model/teachingSchedule.js", () => ({
  default: {
    find: mocks.mockFind,
    findById: mocks.mockFindById,
    findOneAndUpdate: mocks.mockFindOneAndUpdate,
  },
}));

vi.mock("../../../src/model/user.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

// Mock Services
vi.mock("../../../src/service/classStudentService.js", () => ({
  getClassStudents: vi.fn(),
}));

vi.mock("../../../src/service/emailService.js", () => ({
  sendEmail: vi.fn(),
}));

vi.mock("../../../src/service/classService.js", () => ({
  findById: vi.fn(),
}));

// Mock Utils
vi.mock("../../../src/utils/emailTemplete.js", () => ({
  createClassCancellationHtml: vi.fn(),
}));

vi.mock("../../../src/utils/formatVietnameseDate.js", () => ({
  formatVietnameseDate: vi.fn(),
}));

describe("Teaching Schedule Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset behavior chain mặc định
    mocks.mockFind.mockReturnValue({ populate: mocks.mockPopulate });
    mocks.mockFindById.mockReturnValue({ populate: mocks.mockPopulate });
    mocks.mockPopulate.mockReturnValue({
      populate: mocks.mockPopulate,
      sort: mocks.mockSort,
    });
  });

  // --- Structure Verification ---
  describe("Structure Verification", () => {
    it("should export all required functions", () => {
      expect(teachingScheduleService.getSchedulesByTeacher).toBeDefined();
      expect(teachingScheduleService.getSchedulesByClass).toBeDefined();
      expect(teachingScheduleService.getTeachingScheduleById).toBeDefined();
      expect(teachingScheduleService.markAbsence).toBeDefined();
    });
  });

  // --- Test: getSchedulesByTeacher ---
  describe("getSchedulesByTeacher", () => {
    it("should return schedules sorted by date and time", async () => {
      const teacherId = "teacher-1";
      const mockResult = [{ _id: "sch-1" }];
      mocks.mockSort.mockResolvedValue(mockResult);

      const result = await teachingScheduleService.getSchedulesByTeacher(
        teacherId
      );

      expect(TeachingSchedule.find).toHaveBeenCalledWith({
        teacher: teacherId,
      });
      expect(mocks.mockPopulate).toHaveBeenCalledTimes(2); // class, teacher
      expect(mocks.mockSort).toHaveBeenCalledWith({ date: 1, startTime: 1 });
      expect(result).toEqual(mockResult);
    });

    it("should throw 400 if teacherId is missing", async () => {
      await expect(
        teachingScheduleService.getSchedulesByTeacher(null)
      ).rejects.toThrow("Teacher ID is required");
    });
  });

  // --- Test: getSchedulesByClass ---
  describe("getSchedulesByClass", () => {
    it("should return schedules for a class", async () => {
      const classId = "class-1";
      const mockResult = [{ _id: "sch-1" }];
      mocks.mockSort.mockResolvedValue(mockResult);

      const result = await teachingScheduleService.getSchedulesByClass(classId);

      expect(TeachingSchedule.find).toHaveBeenCalledWith({ class: classId });
      expect(mocks.mockPopulate).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResult);
    });

    it("should throw 400 if classId is missing", async () => {
      await expect(
        teachingScheduleService.getSchedulesByClass(null)
      ).rejects.toThrow("Class ID is required");
    });
  });

  // --- Test: getTeachingScheduleById ---
  describe("getTeachingScheduleById", () => {
    it("should return schedule if found", async () => {
      const id = "sch-1";
      const mockSchedule = { _id: id };

      // findById -> populate -> populate -> (return data directly, no sort)
      // Override mockPopulate return value cho lần gọi cuối
      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      mocks.mockPopulate.mockReturnValueOnce(mockSchedule);

      const result = await teachingScheduleService.getTeachingScheduleById(id);

      expect(TeachingSchedule.findById).toHaveBeenCalledWith(id);
      expect(mocks.mockPopulate).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockSchedule);
    });

    it("should throw 404 if schedule not found", async () => {
      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      mocks.mockPopulate.mockReturnValueOnce(null); // Return null

      await expect(
        teachingScheduleService.getTeachingScheduleById("invalid")
      ).rejects.toThrow("Teaching schedule not found");
    });
  });

  // --- Test: markAbsence ---
  describe("markAbsence", () => {
    const teacherId = "teacher-1";
    const classId = "class-1";
    const targetDate = "2024-05-20";
    const shift = 1;

    // Setup Data giả lập
    const mockTeacher = { _id: teacherId, full_name: "Mr. Teacher" };
    const mockClass = { _id: classId, name: "Math 101" };
    const mockStudents = [
      { student: { email: "s1@test.com" } },
      { student: { email: "s2@test.com" } },
    ];
    const mockUpdatedSchedule = { _id: "sch-updated", status: "ABSENT" };

    it("should mark absence and send emails successfully", async () => {
      // 1. Setup Models & Services
      mocks.mockFindOneAndUpdate.mockResolvedValue(mockUpdatedSchedule);
      vi.mocked(User.findById).mockResolvedValue(mockTeacher);
      vi.mocked(classService.findById).mockResolvedValue(mockClass);
      vi.mocked(enrolledService.getClassStudents).mockResolvedValue(
        mockStudents
      );

      // 2. Setup Utils
      vi.mocked(emailTemplate.createClassCancellationHtml).mockReturnValue(
        "<p>Html</p>"
      );
      vi.mocked(dateFormatter.formatVietnameseDate).mockReturnValue(
        "20/05/2024"
      );

      // 3. Exec
      const result = await teachingScheduleService.markAbsence(
        teacherId,
        targetDate,
        shift,
        classId
      );

      // 4. Verify DB Update
      expect(TeachingSchedule.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          teacher: teacherId,
          status: "SCHEDULED", // Chỉ update nếu đang SCHEDULED
          startTime: "06:50", // Ca 1 start time
        }),
        { $set: { status: "ABSENT" } },
        { new: true }
      );

      // 5. Verify Info Retrieval
      expect(User.findById).toHaveBeenCalledWith(teacherId);
      expect(classService.findById).toHaveBeenCalledWith(classId);
      expect(enrolledService.getClassStudents).toHaveBeenCalledWith(classId);

      // 6. Verify Email Sending
      expect(emailTemplate.createClassCancellationHtml).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalledTimes(2); // 2 students
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        "s1@test.com",
        expect.stringContaining("Nghỉ học môn Math 101"),
        "<p>Html</p>",
        "Mr. Teacher",
        expect.anything()
      );

      expect(result).toEqual(mockUpdatedSchedule);
    });

    it("should throw 400 if shift is invalid", async () => {
      await expect(
        teachingScheduleService.markAbsence(teacherId, targetDate, 99, classId)
      ).rejects.toThrow("Ca học không hợp lệ.");
    });

    it("should throw error if teacher not found", async () => {
      mocks.mockFindOneAndUpdate.mockResolvedValue(mockUpdatedSchedule);
      vi.mocked(User.findById).mockResolvedValue(null); // Teacher null
      vi.mocked(classService.findById).mockResolvedValue(mockClass);
      vi.mocked(enrolledService.getClassStudents).mockResolvedValue(
        mockStudents
      );

      await expect(
        teachingScheduleService.markAbsence(
          teacherId,
          targetDate,
          shift,
          classId
        )
      ).rejects.toThrow("Không tìm thấy giáo viên.");
    });

    it("should return undefined (log msg) if no valid students found", async () => {
      // Trường hợp students có trong list nhưng không có email
      const invalidStudents = [{ student: {} }]; // No email

      mocks.mockFindOneAndUpdate.mockResolvedValue(mockUpdatedSchedule);
      vi.mocked(User.findById).mockResolvedValue(mockTeacher);
      vi.mocked(classService.findById).mockResolvedValue(mockClass);
      vi.mocked(enrolledService.getClassStudents).mockResolvedValue(
        invalidStudents
      );

      // Hàm sẽ console.log và return undefined thay vì throw error ở đoạn filter
      const result = await teachingScheduleService.markAbsence(
        teacherId,
        targetDate,
        shift,
        classId
      );

      expect(result).toBeUndefined();
      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });

    it("should throw 404 if schedule not found (already absent or finished)", async () => {
      mocks.mockFindOneAndUpdate.mockResolvedValue(null); // Update failed

      vi.mocked(User.findById).mockResolvedValue(mockTeacher);
      vi.mocked(classService.findById).mockResolvedValue(mockClass);
      vi.mocked(enrolledService.getClassStudents).mockResolvedValue(
        mockStudents
      );

      await expect(
        teachingScheduleService.markAbsence(
          teacherId,
          targetDate,
          shift,
          classId
        )
      ).rejects.toThrow("Không tìm thấy buổi học hợp lệ để báo vắng");
    });
  });
});
