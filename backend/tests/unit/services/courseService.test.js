import { describe, it, expect, vi, afterEach } from "vitest";

// 1. MOCK MODEL
vi.mock("../../../src/model/course.js", () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

// 2. IMPORT SERVICE & MOCKED MODEL
const courseService = await import("../../../src/service/courseService.js");
const Course = (await import("../../../src/model/course.js")).default;

describe("Course Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==========================
  // getAll
  // ==========================
  describe("getAll", () => {
    it("should return all courses sorted by createdAt descending", async () => {
      const mockCourses = [{ _id: "1", title: "Course 1" }];

      // Mock chain: find -> sort
      const mockSort = vi.fn().mockResolvedValue(mockCourses);
      Course.find.mockReturnValue({ sort: mockSort });

      const result = await courseService.getAll();

      expect(Course.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockCourses);
    });
  });

  // ==========================
  // getCourseById
  // ==========================
  describe("getCourseById", () => {
    it("should return course if found", async () => {
      const mockCourse = { _id: "123", title: "Test Course" };
      Course.findById.mockResolvedValue(mockCourse);

      const result = await courseService.getCourseById("123");
      expect(result).toEqual(mockCourse);
    });

    it("should throw 404 if course not found", async () => {
      Course.findById.mockResolvedValue(null);

      try {
        await courseService.getCourseById("invalid");
      } catch (error) {
        expect(error.message).toBe("Course with id invalid not found");
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // ==========================
  // getCourseByCode
  // ==========================
  describe("getCourseByCode", () => {
    it("should return course if found by code", async () => {
      const mockCourse = { _id: "1", code: "CS101" };
      Course.findOne.mockResolvedValue(mockCourse);

      const result = await courseService.getCourseByCode("CS101");

      expect(Course.findOne).toHaveBeenCalledWith({ code: "CS101" });
      expect(result).toEqual(mockCourse);
    });

    it("should throw 404 if course code not found", async () => {
      Course.findOne.mockResolvedValue(null);

      try {
        await courseService.getCourseByCode("BAD_CODE");
      } catch (error) {
        expect(error.message).toBe("Course with code BAD_CODE not found");
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // ==========================
  // createCourse
  // ==========================
  describe("createCourse", () => {
    it("should create a new course", async () => {
      const inputData = { title: "New Course", code: "NC101" };
      const mockResult = { _id: "new_id", ...inputData };

      Course.create.mockResolvedValue(mockResult);

      const result = await courseService.createCourse(inputData);

      expect(Course.create).toHaveBeenCalledWith(inputData);
      expect(result).toEqual(mockResult);
    });
  });

  // ==========================
  // updateCourse
  // ==========================
  describe("updateCourse", () => {
    it("should update course and filter out null values", async () => {
      const id = "123";
      // Input có trường null -> cần bị filter
      const inputData = { title: "Updated", description: null, credit: 3 };
      const mockUpdated = { _id: id, title: "Updated", credit: 3 };

      Course.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await courseService.updateCourse(id, inputData);

      // Kiểm tra logic filter: 'description' phải bị xóa khỏi object update
      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: { title: "Updated", credit: 3 } }, // Không có description
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });

    it("should throw 404 if course to update not found", async () => {
      Course.findByIdAndUpdate.mockResolvedValue(null);

      try {
        await courseService.updateCourse("invalid", { title: "Test" });
      } catch (error) {
        expect(error.message).toBe("Course not found");
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // ==========================
  // deleteCourse
  // ==========================
  describe("deleteCourse", () => {
    it("should delete course if found", async () => {
      const mockDeleted = { _id: "123" };
      Course.findByIdAndDelete.mockResolvedValue(mockDeleted);

      const result = await courseService.deleteCourse("123");
      expect(result).toEqual(mockDeleted);
    });

    it("should throw 404 if course to delete not found", async () => {
      Course.findByIdAndDelete.mockResolvedValue(null);

      try {
        await courseService.deleteCourse("invalid");
      } catch (error) {
        expect(error.message).toBe("Course not found");
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
