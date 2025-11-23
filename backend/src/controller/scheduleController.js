import * as service from "../service/scheduleService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getScheduleBySemester = asyncHandler(async (req, res) => {
  const { semester_id } = req.params;
  const user_id = req.user._id;
  const schedule = await service.getScheduleBySemester(user_id, semester_id);
  res.json(schedule);
});
