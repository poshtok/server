import { Schema, model } from "mongoose";
import { user } from "../interface/db";
import {randomBytes,scryptSync} from "crypto"

const UserSchema = new Schema<user>(
  {
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre('save',function(next){
    const user:any = this
    if (!user.isModified('password')) return next();
    const salt = randomBytes(16).toString("hex")
    user.password = `${scryptSync(user.password, salt, 32).toString("hex")}:${salt}`
    return next();
})
UserSchema.statics.comparePassword = async (storedPassword: string, userPassword: string) => {
    const [key, salt] = storedPassword.split(":")
    const userPass: string = scryptSync(userPassword, salt, 32).toString("hex")
    return userPass === key
};
export default model<user>("user", UserSchema);


