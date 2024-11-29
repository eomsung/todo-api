import mongoose from "mongoose";
import data from "./mock.js";
import { Task } from "../models/Task.js";
import * as dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.DATABASE_URL);

await Task.deleteMany({});

//data 넣는 코드
await Task.insertMany(data);

mongoose.connection.close();

//기존에 데이터베이스에 있었던 데이터들은 다 날리고, 시드데이터를 넣어준다.
