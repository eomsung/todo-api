import mongoose from "mongoose";

const TeskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
      //   validate: {
      //     validator: (title) => title.split(" ").length > 1,
      //     message: "최소 2단어 이상이어야함",
      //   },
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//mongoose에서 모델 -> 스키마를 기반으로 객체를 CRUD 할 수있는 인터페이스(메소드) 제공
export const Task = mongoose.model("Task", TeskSchema);
