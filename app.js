import express from "express";
import { Task } from "./models/Task.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      switch (e.name) {
        case "ValidationError":
          res.status(400).send({ message: e.message });
          break;
        case "CastError":
          res.status(404).send({ message: "Cannot find given id" });
          break;
        default:
          res.status(500).send({ message: e.message });
          break;
      }
    }
  };
};

const app = express();
app.use(
  cors({
    // origin:[
    // ]
  })
);
app.use(express.json());

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };
    const tasks = await Task.find().sort(sortOption).limit(count);
    res.send(tasks);
  })
);

app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    res.send(task);
  })
);

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const task = await Task.create(req.body);
    res.status(201).send(task);
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    }); // 여기까지만 쓰면 데이터 베이스에선 반영되지 않음

    task.updatedAt = new Date();
    await task.save();

    res.send(task);
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Task.findByIdAndRemove(id);
    res.sendStatus(204);
  })
);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
}); //서버를 띄어주는
