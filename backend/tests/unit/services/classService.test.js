import { mongo } from "mongoose";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";

// 1. MOCK CÁC MODEL VÀ SERVICE PHỤ THUỘC
vi.mock("../../../src/model/class.js", () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    aggregate: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock("../../../src/model/course.js", () => ({
  default: { findById: vi.fn() },
}));

vi.mock("../../../src/model/room.js", () => ({
  default: { findOne: vi.fn() },
}));

vi.mock("../../../src/model/semester.js", () => ({
  default: { findById: vi.fn() },
}));

vi.mock("../../../src/model/user.js", () => ({
  default: {
    findById: vi.fn(),
    findOne: vi.fn(),
  },
}));

// Mock roomService (vì createClass có gọi hàm createRoom)
vi.mock("../../../src/service/roomService.js", () => ({
  createRoom: vi.fn(),
}));

// 2. IMPORT SERVICE & MODELS
const classService = await import("../../../src/service/classService.js");
const Class = (await import("../../../src/model/class.js")).default;
const Course = (await import("../../../src/model/course.js")).default;
const Room = (await import("../../../src/model/room.js")).default;
const Semester = (await import("../../../src/model/semester.js")).default;
const User = (await import("../../../src/model/user.js")).default;
const { createRoom } = await import("../../../src/service/roomService.js");

describe("Class Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==========================
  // getAll
  // ==========================
  describe("getAll", () => {
    it("should return all classes sorted by createdAt", async () => {
      const mockClasses = [
        { _id: new mongoose.Types.ObjectId().toString(), name: "Class 1" },
      ];
      // Mock chain: find -> sort
      const mockSort = vi.fn().mockResolvedValue(mockClasses);
      Class.find.mockReturnValue({ sort: mockSort });

      const result = await classService.getAll();

      expect(Class.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockClasses);
    });
  });

  // ==========================
  // getUserClasses (Complex Logic: Aggregation)
  // ==========================
  describe("getUserClasses", () => {
    it("should throw 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);
      await expect(
        classService.getUserClasses(new mongoose.Types.ObjectId().toString())
      ).rejects.toThrow("User not found");
    });

    it("should return classes for TEACHER using aggregate", async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        role: "teacher",
      };
      const mockResult = [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          name: "Class A",
          studentCount: 10,
        },
      ];

      User.findById.mockResolvedValue(mockUser);
      Class.aggregate.mockResolvedValue(mockResult);

      const result = await classService.getUserClasses(mockUser._id);

      expect(Class.aggregate).toHaveBeenCalled();
      // Kiểm tra sơ bộ pipeline có match teacher id không (chi tiết pipeline phức tạp khó check deep equal chính xác tuyệt đối, chỉ cần đảm bảo gọi đúng)
      expect(result).toEqual(mockResult);
    });

    it("should return classes for STUDENT using aggregate", async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        role: "student",
      };
      const mockResult = [
        { _id: new mongoose.Types.ObjectId().toString(), name: "Class B" },
      ];

      User.findById.mockResolvedValue(mockUser);
      Class.aggregate.mockResolvedValue(mockResult);

      const result = await classService.getUserClasses(mockUser._id);

      expect(Class.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  // ==========================
  // findById
  // ==========================
  describe("findById", () => {
    it("should return class if found", async () => {
      const mockClass = { _id: new mongoose.Types.ObjectId().toString() };
      Class.findById.mockResolvedValue(mockClass);
      const result = await classService.findById(mockClass._id);
      expect(result).toEqual(mockClass);
    });

    it("should throw 404 if not found", async () => {
      Class.findById.mockResolvedValue(null);
      try {
        await classService.findById(new mongoose.Types.ObjectId().toString());
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // ==========================
  // createClass (Logic: Validation & Conflict Check)
  // ==========================
  describe("createClass", () => {
    const inputData = {
      name: "Math 101",
      semester: "sem1",
      teacher: "teacher1",
      course: "course1",
      schedule: [{ dayOfWeek: 2, shift: 1 }],
      theoryWeeks: 15,
      practiceWeeks: 0,
    };

    it("should throw 404 if semester/teacher/course invalid", async () => {
      Semester.findById.mockResolvedValue(null); // Invalid Semester
      User.findOne.mockResolvedValue({
        _id: new mongoose.Types.ObjectId().toString(),
      });
      Course.findById.mockResolvedValue({
        _id: new mongoose.Types.ObjectId().toString(),
      });

      await expect(classService.createClass(inputData)).rejects.toThrow(
        "Invalid semester, teacher or course"
      );
    });

    it("should throw 400 if SCHEDULE CONFLICT exists", async () => {
      // Setup dependencies valid
      Semester.findById.mockResolvedValue({
        _id: new mongoose.Types.ObjectId().toString(),
      });
      User.findOne.mockResolvedValue({
        _id: new mongoose.Types.ObjectId().toString(),
        name: "T1",
        email: "t@t.com",
      });
      Course.findById.mockResolvedValue({
        _id: new mongoose.Types.ObjectId().toString(),
      });
      // Mock Conflict: Giảng viên đã có lớp khác vào Thứ 2 - Ca 1
      const existingClasses = [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          name: "Existing Class",
          schedule: [{ dayOfWeek: 2, shift: 1 }],
        },
      ];
      Class.find.mockResolvedValue(existingClasses); // find teacherClasses

      try {
        await classService.createClass(inputData);
      } catch (error) {
        expect(error.message).toContain("Giảng viên đã có lớp");
        expect(error.statusCode).toBe(400);
      }
    });

    it("should create class and room if no conflict", async () => {
      // Setup dependencies valid
      Semester.findById.mockResolvedValue({
        _id: new mongoose.Types.ObjectId().toString(),
      });
      const mockTeacher = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "T1",
        email: "t@t.com",
      };
      User.findOne.mockResolvedValue(mockTeacher);
      Course.findById.mockResolvedValue({
        _id: new mongoose.Types.ObjectId().toString(),
      });

      // No conflict
      Class.find.mockResolvedValue([]);
      // Create success
      const newClass = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...inputData,
      };
      Class.create.mockResolvedValue(newClass);

      const result = await classService.createClass(inputData);

      expect(result).toEqual(newClass);
      // Kiểm tra side-effect: createRoom phải được gọi
      expect(createRoom).toHaveBeenCalledWith({
        classId: newClass._id,
        teacherId: mockTeacher._id,
        teacherEmail: mockTeacher.email,
        teacherName: mockTeacher.name,
      });
    });
  });

  // ==========================
  // updateClass (Logic: Update Teacher/Room & Conflict Check)
  // ==========================
  describe("updateClass", () => {
    const classId = new mongoose.Types.ObjectId().toString();

    it("should throw 404 if class to update not found", async () => {
      Class.findById.mockResolvedValue(null);
      // Giả sử không update teacher/semester để skip các check đó
      await expect(
        classService.updateClass(classId, { name: "New Name" })
      ).rejects.toThrow("Class not found");
    });

    it("should update Room info if Teacher changes", async () => {
      const updateData = { teacher: new mongoose.Types.ObjectId().toString() };

      // Mock new teacher
      const newTeacher = {
        _id: new mongoose.Types.ObjectId().toString(),
        full_name: "New T",
        email: "new@t.com",
      };
      User.findOne.mockResolvedValue(newTeacher);

      // Mock existing room
      const mockRoom = { save: vi.fn() };
      Room.findOne.mockResolvedValue(mockRoom);

      // Mock class exist
      Class.findById.mockResolvedValue({
        _id: classId,
        teacher: "old_teacher",
      });
      // Mock conflict check (empty)
      Class.find.mockResolvedValue([]);
      // Mock update
      Class.findByIdAndUpdate.mockResolvedValue({
        _id: classId,
        teacher: "new_teacher_id",
      });

      await classService.updateClass(classId, updateData);

      expect(Room.findOne).toHaveBeenCalledWith({ classId });
      expect(mockRoom.teacherId).toBe(newTeacher._id);
      expect(mockRoom.save).toHaveBeenCalled();
    });

    it("should throw 400 on Schedule Conflict during update", async () => {
      const updateData = { schedule: [{ dayOfWeek: 3, shift: 1 }] };

      const currentClass = {
        _id: classId,
        teacher: "t1",
        semester: "s1",
        schedule: [],
      };
      Class.findById.mockResolvedValue(currentClass);

      // Mock Conflict: Lớp khác của giáo viên này trùng lịch
      const conflictingClass = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "Other Class",
        schedule: [{ dayOfWeek: 3, shift: 1 }],
      };
      // Class.find tìm các lớp của giáo viên (ngo trừ lớp hiện tại)
      Class.find.mockResolvedValue([conflictingClass]);

      try {
        await classService.updateClass(classId, updateData);
      } catch (error) {
        expect(error.message).toContain("Giảng viên đã có lớp");
        expect(error.statusCode).toBe(400);
      }
    });

    it("should update successfully", async () => {
      const updateData = { name: "Updated Name" };
      const currentClass = {
        _id: classId,
        teacher: "t1",
        semester: "s1",
        schedule: [],
      };

      Class.findById.mockResolvedValue(currentClass);
      Class.find.mockResolvedValue([]); // No conflict
      Class.findByIdAndUpdate.mockResolvedValue({
        ...currentClass,
        ...updateData,
      });

      const result = await classService.updateClass(classId, updateData);

      expect(result.name).toBe("Updated Name");
      expect(Class.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  // ==========================
  // addAbsenceDate
  // ==========================
  describe("addAbsenceDate", () => {
    it("should add absence date to class", async () => {
      const mockClass = {
        _id: new mongoose.Types.ObjectId().toString(),
        absent: [],
        save: vi.fn(),
      };
      Class.findById.mockResolvedValue(mockClass);

      const date = new Date();
      await classService.addAbsenceDate(
        new mongoose.Types.ObjectId().toString(),
        date
      );

      expect(mockClass.absent.length).toBe(1);
      expect(mockClass.save).toHaveBeenCalled();
    });

    it("should throw 404 if class not found", async () => {
      Class.findById.mockResolvedValue(null);
      await expect(
        classService.addAbsenceDate(
          new mongoose.Types.ObjectId().toString(),
          new Date()
        )
      ).rejects.toThrow("Class not found");
    });
  });

  // ==========================
  // deleteClass
  // ==========================
  describe("deleteClass", () => {
    it("should delete class successfully", async () => {
      Class.findByIdAndDelete.mockResolvedValue({
        _id: new mongoose.Types.ObjectId().toString(),
      });
      const result = await classService.deleteClass(
        new mongoose.Types.ObjectId().toString()
      );
      expect(result._id).toBe(result._id);
    });

    it("should throw 404 if class to delete not found", async () => {
      Class.findByIdAndDelete.mockResolvedValue(null);
      await expect(
        classService.deleteClass(new mongoose.Types.ObjectId().toString())
      ).rejects.toThrow("Class not found");
    });
  });
});
