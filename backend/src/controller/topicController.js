import * as service from "../service/topicService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAllTopics = asyncHandler(async (req, res) => {
  const topics = await service.getAllTopics();
  res.status(200).json(topics);
});

export const createTopic = asyncHandler(async (req, res) => {
  const topic = await service.createTopic(req.body);
  res.status(201).json(topic);
});

export const updateTopic = asyncHandler(async (req, res) => {
  const topic = await service.updateTopic(req.params.id, req.body);
  res.status(200).json(topic);
});

export const deleteTopic = asyncHandler(async (req, res) => {
  await service.deleteTopic(req.params.id);
  res.status(200).json({ message: "Topic deleted successfully" });
});
