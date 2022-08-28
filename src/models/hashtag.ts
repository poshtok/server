import  { Schema, model } from "mongoose";
import { HashtagM } from "../interface/db";

const HashtagSchema = new Schema<HashtagM>(
  {
    post: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    hashtag: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<HashtagM>("hashtag",HashtagSchema)
