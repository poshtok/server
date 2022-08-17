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

class AuthDataSource extends Base{
  async signup(data: signup) {
    const { email, password }: signup = data;
    if (!email && !password) throw new UserInputError("input values are required");
    const user = await __User.findOne({ email });
    if (user) throw new UserInputError("email, already exist");
    const emailCode = await this.getCodeNumber("uc", __User);
   let account = await __User.create({ email, password });
    this.sendMail(account.email, "Welcome To PoshTok", "welcome", {
      name: account.email.split("@")[0],
      message: `Your Poshtok account has been created, use the code below to verify your email`,
      code: emailCode,
    });
    return {
      message: "Successfully created an Account",
     token:"jgjgjdnjnbljdfgd",
    };
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

    return generateToken(user as any)
  }

  async updatePerson(data: Person, person: loggedInInterface) {
    const NotFound: string = "Unable to validate authenticated account";
    const user = await __User.findById({ _id: person._id });
    if (!user) throw new AuthenticationError(NotFound);

    let foundPerson = await __Person.findOne({ user: user._id });

    if (!foundPerson) {
      await __Person.create({ ...data, user: user._id });
      return "updates successful";
    }
    await __Person.findOneAndUpdate({ user: user._id }, { ...data });

    return "updates successful";
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
 }


export default AuthDataSource;
