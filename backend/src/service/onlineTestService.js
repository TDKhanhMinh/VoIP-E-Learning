import mongoose from "mongoose";
import Class from "../model/class.js";
import OnlineTest from "../model/online_test.js";
import TestQuestion from "../model/testQuestion.js";
import ClassStudent from "../model/class_student.js";
export const getAll = async () => {
  const tests = OnlineTest.find().sort({ createdAt: -1 });
  return tests;
};

export async function getClassTests(classId) {
  const classDoc = await Class.findById(classId)
    .select("_id name teacher")
    .populate("teacher", "_id name email")
    .lean();

  if (!classDoc) throw new Error("Class not found");

  const studentCount = await ClassStudent.countDocuments({
    class: classId,
  });

  const tests = await OnlineTest.aggregate([
    {
      $match: { class: new mongoose.Types.ObjectId(classId) },
    },

    {
      $lookup: {
        from: "testattempts",
        localField: "_id",
        foreignField: "onlineTest",
        as: "attempteds",
      },
    },

    {
      $addFields: {
        attemptCount: {
          $size: {
            $setUnion: [
              {
                $map: {
                  input: "$attempteds",
                  as: "att",
                  in: "$$att.student",
                },
              },
              [],
            ],
          },
        },
      },
    },

    { $sort: { createdAt: -1 } },

    {
      $project: {
        attempteds: 0,
      },
    },
  ]);

  return {
    class: {
      _id: classDoc._id,
      name: classDoc.name,
      teacher: classDoc.teacher,
      studentCount,
    },
    tests,
  };
}

export const getStudentTests = async (studentId) => {
  return OnlineTest.aggregate([
    {
      $lookup: {
        from: "classstudents",
        let: { classId: "$class" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$class", "$$classId"] },
                  { $eq: ["$student", studentId] },
                ],
              },
            },
          },
        ],
        as: "matchStudent",
      },
    },

    { $match: { matchStudent: { $ne: [] } } },

    {
      $lookup: {
        from: "users",
        localField: "teacher",
        foreignField: "_id",
        as: "teacherInfo",
      },
    },
    { $unwind: "$teacherInfo" },

    {
      $project: {
        matchStudent: 0,
        "teacherInfo.password": 0,
        "teacherInfo.email": 0,
      },
    },

    { $sort: { createdAt: -1 } },
  ]);
};

export const getById = async (id) => {
  const test = await OnlineTest.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "testquestions",
        localField: "_id",
        foreignField: "test",
        as: "questions",
      },
    },
    { $limit: 1 },
  ]);
  return test[0] || null;
};

export const createTest = async (data) => {
  data.questions = [];
  const newTest = new OnlineTest(data);
  await newTest.save();
  return newTest;
};

export const updateTest = async (id, data) => {
  if (data.end && new Date(data.end) > new Date()) {
    data.available = true;
  }
  const updatedTest = await OnlineTest.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedTest;
};

export const updateTestQuestions = async (testId, questions) => {
  try {
    const existingQuestions = await TestQuestion.find({ test: testId });
    const existingIds = existingQuestions.map((q) => q._id.toString());

    const incomingIds = questions
      .filter((q) => q._id)
      .map((q) => q._id.toString());

    const toDelete = existingIds.filter((id) => !incomingIds.includes(id));

    const ops = [];

    for (const q of questions) {
      if (q._id) {
        ops.push({
          updateOne: {
            filter: { _id: q._id },
            update: {
              $set: {
                question: q.question,
                options: q.options,
                image: q.image || null,
              },
            },
          },
        });
      } else {
        ops.push({
          insertOne: {
            document: {
              test: testId,
              question: q.question,
              options: q.options.map(({ _id, ...opt }) => opt),
              image: q.image || null,
            },
          },
        });
      }
    }

    for (const id of toDelete) {
      ops.push({
        deleteOne: {
          filter: { _id: id },
        },
      });
    }

    if (ops.length > 0) {
      await TestQuestion.bulkWrite(ops);
    }

    return {
      message: "Questions updated successfully",
      deletedQuestions: toDelete,
    };
  } catch (error) {
    console.error("Update TestQuestions Error:", error);
    throw new Error("Failed to update test questions");
  }
};

export const deleteTest = async (id) => {
  await OnlineTest.findByIdAndDelete(id);
};
