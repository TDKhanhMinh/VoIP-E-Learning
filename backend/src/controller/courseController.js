import { asyncHandler } from "../middlewares/asyncHandler.js";
import * as service from "../service/courseService.js";

export const getAll = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (code) {
    const course = await service.getCourseByCode(code);
    if (!course) {
      return res.status(404).json({ message: `Course code ${code} not found` });
    }
    return res.json(course);
  }

  const courses = await service.getAll();
  res.json(courses);
});

export const getCourseByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;
  console.log(code);
  const course = await service.getCourseByCode(code);
  res.status(200).json(course);
});

export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const course = await service.getCourseById(id);
  res.status(200).json(course);
});

export const createCourse = asyncHandler(async (req, res) => {
  const data = req.body;
  const course = await service.createCourse(data);
  res.status(201).json(course);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const course = await service.updateCourse(id, data);
  res.status(200).json(course);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await service.deleteCourse(id);
  res.status(200).json(course);
});
