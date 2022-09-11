import { model, Schema } from "mongoose";
import { PostM } from "../interface/db";
import mongoosastic from "mongoosastic";
import { Client } from '@elastic/elasticsearch'

const esClient = new Client({ node: 'http://localhost:9200' })





const PostSchema = new Schema<PostM>(
  {
    caption: {
      type: String,
      es_indexed: true
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
PostSchema.plugin((mongoosastic as any), {
  esClient: esClient
})
// PostSchema.plugin((mongoosastic as any))

export default model<PostM>("posts", PostSchema);
