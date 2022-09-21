import mongoose, { model, Schema } from "mongoose";
import { PostM } from "../interface/db";
import mongoosastic from "mongoosastic";
import { Client } from '@elastic/elasticsearch'

const esClient = new Client({ node: 'http://localhost:9200' })





const PostSchema = new Schema<PostM>(
  {
    caption: {
      type: String,
    },
    file: {
      type: String,
      required: true,
    },
    likes: { type: Number,default:0 },
    tags: [{ type: Schema.Types.ObjectId, }],
    hashTags: [{ type: String,}],
    comments:{type:Number,default:0 },
    views:{type:Number,default:0 },
    user:{
      type:Schema.Types.ObjectId,
      required:true
    }
  },
  {
    timestamps: true,
  }
);
PostSchema.plugin((mongoosastic as any), {
  esClient: esClient
})
// PostSchema.plugin((mongoosastic as any))

export default model<PostM>("posts", PostSchema);
