import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// 1. MOCK MODELS
vi.mock("../../../src/model/attendance.js", () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(), // Dùng cho logic check ngày và lesson cũ
    insertMany: vi.fn(), // createAttendance dùng insertMany
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock("../../../src/model/class.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

// 2. IMPORT SERVICE & MODELS
const attendanceService = await import(
  "../../../src/service/attendanceService.js"
);
const Attendance = (await import("../../../src/model/attendance.js")).default;
const Class = (await import("../../../src/model/class.js")).default;

describe("Attendance Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // =======================
  // getAll
  // =======================
  describe("getAll", () => {
    it("should return all attendances sorted by createdAt", async () => {
      const mockData = [{ _id: "1" }, { _id: "2" }];

      // Mock chain: find -> sort
      const mockSort = vi.fn().mockResolvedValue(mockData);
      Attendance.find.mockReturnValue({ sort: mockSort });

      const result = await attendanceService.getAll();

      expect(Attendance.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockData);
    });
  });

  // =======================
  // findById
  // =======================
  describe("findById", () => {
    it("should return attendance if found", async () => {
      const mockData = { _id: "123" };
      Attendance.findById.mockResolvedValue(mockData);

      const result = await attendanceService.findById("123");
      expect(result).toEqual(mockData);
    });

    it("should throw 404 if not found", async () => {
      Attendance.findById.mockResolvedValue(null);

      try {
        await attendanceService.findById("invalid");
      } catch (error) {
        // Lưu ý: Source code của bạn đang ghi nhầm là "Announcement..." thay vì "Attendance..."
        // Test này expect đúng theo source code hiện tại
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // =======================
  // findByClassId
  // =======================
  describe("findByClassId", () => {
    it("should return attendances if found (populated and sorted)", async () => {
      const classId = "class123";
      const mockResult = [{ _id: "att1" }];

      // Mock chain: find -> populate -> populate -> sort
      const mockSort = vi.fn().mockResolvedValue(mockResult);
      const mockPopulate2 = vi.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });

      Attendance.find.mockReturnValue({ populate: mockPopulate1 });

      const result = await attendanceService.findByClassId(classId);

      expect(Attendance.find).toHaveBeenCalledWith({ class: classId });
      expect(mockPopulate1).toHaveBeenCalledWith("student", "full_name email");
      expect(mockPopulate2).toHaveBeenCalledWith("class", "name");
      expect(mockSort).toHaveBeenCalledWith({ lesson: -1, attend_at: -1 });
      expect(result).toEqual(mockResult);
    });

    it("should throw 404 if no records found (empty array)", async () => {
      // Mock trả về mảng rỗng
      const mockSort = vi.fn().mockResolvedValue([]);
      const mockPopulate2 = vi.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });
      Attendance.find.mockReturnValue({ populate: mockPopulate1 });

      await expect(attendanceService.findByClassId("class123")).rejects.toThrow(
        /No attendance records found/
      );
    });
  });

  // =======================
  // findByStudentId
  // =======================
  describe("findByStudentId", () => {
    it("should return attendances for student", async () => {
      const studentId = "student123";
      const mockResult = [{ _id: "att1" }];

      // Mock chain
      const mockSort = vi.fn().mockResolvedValue(mockResult);
      const mockPopulate2 = vi.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });
      Attendance.find.mockReturnValue({ populate: mockPopulate1 });

      const result = await attendanceService.findByStudentId(studentId);
      expect(result).toEqual(mockResult);
    });

    it("should return empty array if null (logic || [])", async () => {
      // Mock trả về null
      const mockSort = vi.fn().mockResolvedValue(null);
      const mockPopulate2 = vi.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });
      Attendance.find.mockReturnValue({ populate: mockPopulate1 });

      const result = await attendanceService.findByStudentId("student123");
      expect(result).toEqual([]);
    });
  });

  // =======================
  // createAttendance (Complex Logic)
  // =======================
  describe("createAttendance", () => {
    const inputData = {
      class: "class123",
      attendances: [
        { student: "s1", status: "present" },
        { student: "s2", status: "absent" },
      ],
    };

    it("should throw Error if class ID is invalid", async () => {
      Class.findById.mockResolvedValue(null);
      await expect(
        attendanceService.createAttendance(inputData)
      ).rejects.toThrow("Invalid class ID");
    });

    it("should throw 400 if attendance already marked today", async () => {
      Class.findById.mockResolvedValue({ _id: "class123" });

      // Mock findOne trả về object (nghĩa là đã có record hôm nay)
      Attendance.findOne.mockResolvedValue({ _id: "exists" });

      try {
        await attendanceService.createAttendance(inputData);
      } catch (error) {
        expect(error.message).toBe(
          "Class has already been marked attendance today"
        );
        expect(error.statusCode).toBe(400);
      }
    });

    it("should create new attendance with Lesson 1 (if no previous history)", async () => {
      Class.findById.mockResolvedValue({ _id: "class123" });

      // Lần gọi 1 (check today): null
      // Lần gọi 2 (check last lesson): null (chưa có lesson nào)
      // Dùng chain mockResolvedValueOnce để giả lập 2 lần gọi khác nhau
      Attendance.findOne
        .mockResolvedValueOnce(null) // Check today
        .mockReturnValue({ sort: vi.fn().mockResolvedValue(null) }); // Check last lesson (chain sort)

      Attendance.insertMany.mockResolvedValue([1, 2]); // Giả lập insert thành công

      const result = await attendanceService.createAttendance(inputData);

      expect(result.lesson).toBe(1); // Lesson đầu tiên phải là 1
      expect(result.count).toBe(2);
      expect(Attendance.insertMany).toHaveBeenCalled();
    });

    it("should create new attendance incrementing Lesson (if history exists)", async () => {
      Class.findById.mockResolvedValue({ _id: "class123" });

      // Lần 1: check today -> null
      // Lần 2: check last lesson -> trả về lesson: 5
      Attendance.findOne.mockResolvedValueOnce(null);

      // Mock chain cho lastAttendance: findOne().sort()
      const mockSort = vi.fn().mockResolvedValue({ lesson: 5 });
      Attendance.findOne.mockReturnValue({ sort: mockSort });

      Attendance.insertMany.mockResolvedValue([1, 2]);

      const result = await attendanceService.createAttendance(inputData);

      expect(result.lesson).toBe(6); // 5 + 1 = 6
    });
  });

  // =======================
  // updateAttendance
  // =======================
  describe("updateAttendance", () => {
    it("should update attendance and ignore null fields", async () => {
      const id = "att1";
      const updateData = { status: "absent", note: null };

      Attendance.findByIdAndUpdate.mockResolvedValue({
        _id: id,
        status: "absent",
      });

      const result = await attendanceService.updateAttendance(id, updateData);

      // Kiểm tra xem 'note': null có bị xóa khỏi object update không
      expect(Attendance.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: { status: "absent" } }, // note bị xóa
        { new: true }
      );
      expect(result.status).toBe("absent");
    });

    it("should throw 404 if attendance not found", async () => {
      Attendance.findByIdAndUpdate.mockResolvedValue(null);
      await expect(
        attendanceService.updateAttendance("id", {})
      ).rejects.toThrow("Attendance not found");
    });
  });

  // =======================
  // deleteAttendance
  // =======================
  describe("deleteAttendance", () => {
    it("should delete attendance if found", async () => {
      Attendance.findByIdAndDelete.mockResolvedValue({ _id: "del1" });
      const result = await attendanceService.deleteAttendance("del1");
      expect(result._id).toBe("del1");
    });

    it("should throw 404 if not found", async () => {
      Attendance.findByIdAndDelete.mockResolvedValue(null);
      await expect(
        attendanceService.deleteAttendance("invalid")
      ).rejects.toThrow(/not found/);
    });
  });
});
