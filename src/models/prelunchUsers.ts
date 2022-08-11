import { Schema, model } from "mongoose";

const prelunchUserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    require:true
  },
  fullName: {
    type: String,
    require:true
  },
},{
    timestamps:true
});
export default model("prelunchuser",prelunchUserSchema)
