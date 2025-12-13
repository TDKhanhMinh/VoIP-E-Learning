import { describe, it, expect, vi, afterEach } from "vitest";
import mongoose from "mongoose";

// 1. MOCK MODELS
vi.mock("../../../src/model/class.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

vi.mock("../../../src/model/user.js", () => ({
  default: {
    find: vi.fn(),
  },
}));

vi.mock("../../../src/model/class_student.js", () => ({
  default: {
    aggregate: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    insertMany: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

// 2. IMPORT SERVICE & MODELS
const classStudentService = await import(
  "../../../src/service/classStudentService.js"
);
const Class = (await import("../../../src/model/class.js")).default;
const User = (await import("../../../src/model/user.js")).default;
const ClassStudent = (await import("../../../src/model/class_student.js"))
  .default;

describe("Class Student Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==========================
  // getClassStudents (Aggregation)
  // ==========================
  describe("getClassStudents", () => {
    it("should return aggregated student list", async () => {
      const classId = new mongoose.Types.ObjectId().toString();
      const mockResult = [
        {
          student: { full_name: "Test Student", email: "test@test.com" },
          class: classId,
        },
      ];

      ClassStudent.aggregate.mockResolvedValue(mockResult);

      const result = await classStudentService.getClassStudents(classId);

      expect(ClassStudent.aggregate).toHaveBeenCalled();
      // Kiểm tra tham số đầu tiên của pipeline có match classId không
      const pipeline = ClassStudent.aggregate.mock.calls[0][0];
      expect(pipeline[0].$match.class).toBeInstanceOf(mongoose.Types.ObjectId);
      expect(result).toEqual(mockResult);
    });
  });

  // ==========================
  // getAllEnrollments
  // ==========================
  describe("getAllEnrollments", () => {
    it("should return all enrollments sorted by createdAt", async () => {
      const mockData = [{ _id: new mongoose.Types.ObjectId().toString() }];
      // Mock chain: find -> sort
      const mockSort = vi.fn().mockResolvedValue(mockData);
      ClassStudent.find.mockReturnValue({ sort: mockSort });

      const result = await classStudentService.getAllEnrollments();

      expect(ClassStudent.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockData);
    });
  });

  // ==========================
  // findByStudentId
  // ==========================
  describe("findByStudentId", () => {
    it("should return enrollments with deep population", async () => {
      const studentId = new mongoose.Types.ObjectId().toString();
      const mockData = [{ _id: new mongoose.Types.ObjectId().toString() }];

      // Mock chain: find -> populate -> populate -> sort
      const mockSort = vi.fn().mockResolvedValue(mockData);
      const mockPopulate2 = vi.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });

      ClassStudent.find.mockReturnValue({ populate: mockPopulate1 });

      const result = await classStudentService.findByStudentId(studentId);

      expect(ClassStudent.find).toHaveBeenCalledWith({ student: studentId });
      // Kiểm tra xem có gọi populate đúng cấu trúc object không
      expect(mockPopulate1).toHaveBeenCalledWith(
        expect.objectContaining({ path: "class" })
      );
      expect(mockPopulate2).toHaveBeenCalledWith("student", "full_name email");
      expect(result).toEqual(mockData);
    });
  });

  // ==========================
  // findById
  // ==========================
  describe("findById", () => {
    it("should return class student record if found", async () => {
      const mockData = { _id: new mongoose.Types.ObjectId().toString() };
      ClassStudent.findById.mockResolvedValue(mockData);
      const result = await classStudentService.findById(mockData._id);
      expect(result).toEqual(mockData);
    });

    it("should throw 404 if not found", async () => {
      ClassStudent.findById.mockResolvedValue(null);
      try {
        await classStudentService.findById(
          new mongoose.Types.ObjectId().toString()
        );
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain("not found");
      }
    });
  });

  // ==========================
  // createClassStudent (Complex Logic)
  // ==========================
  describe("createClassStudent", () => {
    const classId = new mongoose.Types.ObjectId().toString();
    const studentIds = [
      new mongoose.Types.ObjectId().toString(),
      new mongoose.Types.ObjectId().toString(),
    ];
    const inputData = { class: classId, student: studentIds };

    it("should throw 404 if class does not exist", async () => {
      Class.findById.mockResolvedValue(null);
      await expect(
        classStudentService.createClassStudent(inputData)
      ).rejects.toThrow("Invalid class id");
    });

    it("should throw 400 if no students provided", async () => {
      Class.findById.mockResolvedValue({ _id: classId });
      await expect(
        classStudentService.createClassStudent({ class: classId, student: [] })
      ).rejects.toThrow("No student(s) provided");
    });

    it("should throw 404 if no valid users found in DB", async () => {
      Class.findById.mockResolvedValue({ _id: classId });
      User.find.mockResolvedValue([]);

      await expect(
        classStudentService.createClassStudent(inputData)
      ).rejects.toThrow("No valid student found");
    });

    it("should throw 400 if all students are already enrolled", async () => {
      Class.findById.mockResolvedValue({ _id: classId });

      const validUsers = [
        { _id: new mongoose.Types.ObjectId().toString() },
        { _id: new mongoose.Types.ObjectId().toString() },
      ];
      User.find.mockResolvedValue(validUsers);

      // Mock ClassStudent.find trả về danh sách đã tồn tại trùng khớp
      ClassStudent.find.mockResolvedValue([
        { student: validUsers[0]._id },
        { student: validUsers[1]._id },
      ]);

      try {
        await classStudentService.createClassStudent(inputData);
      } catch (error) {
        expect(error.message).toBe("All students already joined this class");
        expect(error.statusCode).toBe(400);
      }
    });

    it("should add new students and filter out existing ones", async () => {
      Class.findById.mockResolvedValue({ _id: classId });

      // Input 2 students: s1 (new), s2 (existing)
      const validUsers = [
        { _id: new mongoose.Types.ObjectId().toString() },
        { _id: new mongoose.Types.ObjectId().toString() },
      ];
      User.find.mockResolvedValue(validUsers);

      // Existing returns only s2
      ClassStudent.find.mockResolvedValue([{ student: validUsers[1]._id }]);
      // Mock insertMany returning the created document (only s1)
      ClassStudent.insertMany.mockResolvedValue([
        { student: validUsers[0]._id, class: classId },
      ]);

      const result = await classStudentService.createClassStudent(inputData);

      expect(User.find).toHaveBeenCalledWith({
        _id: { $in: studentIds },
        available: true,
      });

      // Kiểm tra insertMany chỉ được gọi với student1 (student2 bị lọc)
      const insertCallArgs = ClassStudent.insertMany.mock.calls[0][0];
      expect(insertCallArgs).toHaveLength(1);
      expect(insertCallArgs[0].student).toBe(validUsers[0]._id);

      expect(result).toEqual({
        class: classId,
        added: 1,
        skipped: 1,
        message: "1 student(s) added successfully",
      });
    });
  });

  // ==========================
  // deleteClassStudent
  // ==========================
  describe("deleteClassStudent", () => {
    it("should delete enrollment if found", async () => {
      const mockData = { _id: new mongoose.Types.ObjectId().toString() };
      ClassStudent.findByIdAndDelete.mockResolvedValue(mockData);
      const result = await classStudentService.deleteClassStudent(mockData._id);
      expect(result._id).toBe(mockData._id);
    });

    it("should throw 404 if enrollment not found", async () => {
      ClassStudent.findByIdAndDelete.mockResolvedValue(null);
      await expect(
        classStudentService.deleteClassStudent(
          new mongoose.Types.ObjectId().toString()
        )
      ).rejects.toThrow("Class student not found");
    });
  });
});
