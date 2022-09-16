import { loggedInInterface, Person, signup } from "./interface";
import __User from "../.././models/user";
import __Person from "../.././models/person";
import {
  AuthenticationError,
  UserInputError,
  ValidationError,
} from "apollo-server-express";
import Base from "../../base";
import crypto from "crypto";
import generateToken from "../../utils/lib/generateToken";
import { ObjectId } from "mongoose";
import ExpireTime, { isExpired } from "../../utils/lib/expireTime";
import { validate } from "graphql";
import { response } from "express";

class AuthDataSource extends Base {
  async signup(data: signup) {
    try {
      const { email, password }: signup = data;
      if (!email && !password) {
        throw new UserInputError("input values are required");
      }
      const user = await __User.findOne({ email });

      if (user) throw new UserInputError("email, already exist");
      const emailCode = await this.getCodeNumber();
      let account = await __User.create({
        email,
        password,
        emailVerificationCode: emailCode,
        emailVerificationExpires: ExpireTime(10),
      });
      await __Person.create({ user: account._id });
      this.sendMail(account.email, "Welcome To PoshTok", "welcome", {
        name: account.email.split("@")[0],
        message: `Your Poshtok account has been created, use the code below to verify your email`,
        code: emailCode,
      });
      return {
        message: "Successfully created an Account",
        token: generateToken(account as any),
      };
    } catch (err: any) {
      return { message: err.message };
    }
  }

  async loginUser({ email, password }: { email: string; password: string }) {
    const NotFound: string = "Invalid login credentials";
    const user = await __User.findOne({ email });
    if (!user) throw new UserInputError(NotFound);

    const isPass = await (__User as any).comparePassword(
      user.password,
      password
    );
    if (!isPass) throw new UserInputError(NotFound);
    let userInfo = await (__Person as any).getFew(user._id);

    return { token: generateToken(user as any), userInfo:{...userInfo,_id:user._id} };
  }

  async updatePerson(data: Person, person: loggedInInterface) {
    const NotFound: string = "Unable to validate authenticated account";
    await this.isLoggedin(person);

    const user = await __User.findById(person._id);
    if (!user) throw new AuthenticationError(NotFound);
    await __Person.findOneAndUpdate({ user: user._id }, { ...data });
    let userInfo = await (__Person as any).getFew(user._id);

    return userInfo;
  }
  async forgotPassword(email: string, origin: string) {
    if (!origin) throw new Error(`expected origin but got ${origin}`);
    const account = await __User.findOne({ email });
    if (!account) throw new UserInputError("Email not registered with us");
    const token = crypto.randomBytes(20).toString("hex");

    await (account as any).save();
    // const protocol = isDev ? "http://" : "https://"
    const url = `${origin}/reset/${token}`;
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account is its you kindly or follow this link ${url} or click the button `;
    this.sendMail(
      account.email,
      "Reset your PoshTok password",
      // templateName.resetPassword,
      "code1111",
      { message, url }
    );
    return account._id;
  }
  async resetPassword(
    data: { password: string; token: string },
    origin: string
  ) {
    // const account: IUser = await __User.findOne({
    const account: any = await __User.findOne({
      resetPasswordToken: data.token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!account)
      throw new UserInputError(
        "Password reset token is invalid or has expired."
      );
    account.password = data.password;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpires = undefined;
    const message =
      "Your password was Update successfully, if this was not you kindly request for a new password update";
    const url = `${origin}/dashboard`;
    this.sendMail(
      account.email,
      "Password Updated",
      // templateName.updatePassword,
      "code11111",
      { message, url }
    );
    // const tokens: Array<string | ObjectId> = signJWT(
    //   { lastReset: account.lastReset, email: account.email, _id: account._id },
    //   "5s",
    //   "1h"
    // );
    // tokens.push(account._id);
    return "tokens";
  }

  async updatePassword(
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    person: loggedInInterface
  ) {
    const NotFound: string = "User not found";
    this.isLoggedin(person);
    const user = await __User.findById({ _id: person._id });
    if (!user) throw new UserInputError(NotFound);

    let isPassword = await (__User as any).comparePassword(
      user.password,
      oldPassword
    );
    if (!isPassword) throw new UserInputError(NotFound);

    user.password = newPassword;

    await user.save();

    return "updates successful";
  }
  async verifyEmail({ code }: { code: number }, person: loggedInInterface) {
    try {
      await this.isLoggedin(person);
      let isFound: any = await __User.findOne({ _id: person._id });
      let isFoundPerson: any = await __Person.findOne({ user: person._id });
      if (isFoundPerson.emailVerified) {
        return "Account Already verified";
      }
      if (
        isFound.emailVerificationCode === code &&
        isExpired(isFound.emailVerificationExpires)
      ) {
        return new AuthenticationError("code Expired");
      }
      if (
        isFound.emailVerificationCode === code &&
        isExpired(isFound.emailVerificationExpires) === false
      ) {
        isFound.emailVerificationCode = undefined;
        isFound.emailVerificationExpires = undefined;
        await isFound.save();
        await __Person.findOneAndUpdate(
          { user: person._id },
          { emailVerified: true }
        );
        return "Email Verified";
      } else if (isFound.emailVerificationCode !== code) {
        return new UserInputError("incorrect Code");
      } else {
        return "user not found";
      }
    } catch (e: any) {
      console.log(e.message);
      return "Internal Server Error";
    }
  }
  async resendVerificationCode({ email }: { email: String }) {
    let isFound = await __User.findOne({ email });
    if (!isFound) {
      return new UserInputError("email address not registered");
    }
    let isVerified = await __Person.findOne({
      user: isFound._id,
      emailVerified: true,
    });
    if (isVerified) {
      return "Account Already Verified";
    }
    const emailCode = await this.getCodeNumber();
    await __User.findOneAndUpdate(
      { _id: isFound._id },
      {
        emailVerificationCode: emailCode,
        emailVerificationExpires: ExpireTime(10),
      }
    );
    this.sendMail(isFound.email, "Welcome To PoshTok", "welcome", {
      name: isFound.email.split("@")[0],
      message: `Your Poshtok account has been created, use the code below to verify your email`,
      code: emailCode,
    });
    return "code resent";
  }
  async friendsToFollow({ data }: { data: Array<string> }) {
    // validate
    return await __Person.find({ phone: { $in: data } });
  }
  async follow({ userId }: { userId: ObjectId }, person: loggedInInterface) {
    await this.isLoggedin(person);
    await __Person.findOneAndUpdate(
      { user: userId },
      { $push: { followers: person._id } }
    );
    await __Person.findOneAndUpdate(
      { user: person._id },
      { $push: { following: userId } }
    );
    return "followed";
  }
  async unFollow({ userId }: { userId: ObjectId }, person: loggedInInterface) {
    await this.isLoggedin(person);
    await __Person.findOneAndUpdate(
      { user: userId },
      { $pull: { followers: person._id } }
    );
    await __Person.findOneAndUpdate(
      { user: person._id },
      { $pull: { following: userId } }
    );
    return "unfollowed";
  }
  async isFollowing(
    { userId }: { userId: ObjectId },
    person: loggedInInterface
  ) {
    await this.isLoggedin(person);
    let isFollowing = await __Person.findOne({
      user: userId,
      followers: { $in: person._id },
    });
    if (isFollowing) {
      return true;
    }
    return false;
  }
  async getFollowers(person: loggedInInterface) {
    await this.isLoggedin(person);
    let { followers }: any = await __Person.findOne({ user: person._id });
    let filter = { fullName: 1, userName: 1, avater: 1,user:1 };
    let userFollowers = __Person.find({ user: { $in: followers } },filter,(err, info:any) => {
        let reponse = {...info,_id:info.user}
        delete (response as any ).user
        return response;
      }
    ).clone()
    return userFollowers;
  }
  async getUserFollowers({ userId }: { userId: ObjectId }, person: loggedInInterface) {
    await this.isLoggedin(person);
    let { followers=[] }: any = await __Person.findOne({ user: userId });
    let filter = { fullName: 1, userName: 1, avater: 1,user:1 };
    let userFollowers = __Person.find({ user: { $in: followers } },filter,(err, info:any) => {
        let response = {...info,_id:info.user}
        delete (response as any ).user
        return response;
      }
    ).clone()
    return userFollowers;
  }
  async getFollowing(person: loggedInInterface) {
    await this.isLoggedin(person);
    let { following }: any = await __Person.findOne({ user: person._id });
    let filter = { fullName: 1, userName: 1, avater: 1,user:1 };
    let userFollowing = __Person.find({ user: { $in: following } },filter,(err, info:any) => {
        let reponse = {...info,_id:info.user}
        delete (response as any ).user

        return response;
      }
    ).clone()
    return userFollowing;
  }
  async getCurrentUser(person:loggedInInterface){
    try {
      await this.isLoggedin(person)
      let info:any = await __Person.findOne({user:person._id})
      let followers:Number = info._doc.followers.length
      let following:Number = info._doc.following.length
      let _id:ObjectId = info._doc.user
      delete info._doc.user
      let response = {...info._doc,_id,followers:followers,following}
      return response
    } catch (error:any) {
      console.log(error.messsage)
      return "Internal Server Error"
    }
  }
   async getUser({ userId }: { userId: ObjectId }, person: loggedInInterface) {
    try {
      await this.isLoggedin(person)
      let info:any = await __Person.findOne({user:userId})
      let followers:Number = info._doc.followers.length
      let following:Number = info._doc.following.length
      let _id:ObjectId = info._doc.user
      delete info._doc.user
      let response = {...info._doc,_id,followers:followers,following}
      return response
    } catch (error:any) {
      console.log(error.messsage)
      return "Internal Server Error"
    }
  }
 
  async getUserFollowing({ userId }: { userId: ObjectId }, person: loggedInInterface) {
    await this.isLoggedin(person);
    let { following=[] }: any = await __Person.findOne({ user: userId });
    let filter = { fullName: 1, userName: 1, avater: 1,user:1 };
    let userFollowing:any = await __Person.find({ user: { $in: following } },filter,(err, info:any) => {
        let response = {...info,_id:info.user}
        delete (response as any ).user

        return response;
      }
    ).clone()
    console.log(userFollowing)

    return userFollowing;
  }
}

export default AuthDataSource;
