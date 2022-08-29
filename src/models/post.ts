import { model, Schema } from "mongoose";
import { PostM } from "../interface/db";
const PostSchema = new Schema<PostM>(
  {
    caption: {
      type: String,
      index: true,
    },
    file: {
      type: String,
      required: true,
    },
    likes: { type: Number },
    tags: [{ type: Schema.Types.ObjectId }],
    hashtag: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default model<PostM>("posts", PostSchema);
