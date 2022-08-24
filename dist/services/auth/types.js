"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTypes = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.authTypes = (0, apollo_server_express_1.gql) `
  extend type Mutation {
    signup(data: Signupinput): SignupResponse
    loginUser(data:loginUserInput):loginResponse
    updatePerson(data:updatePersonInput):String
  forgotPassword(email:String):String
  resetPassword(data:resetPasswordInput):String
  verifyEmail(data:verifyEmailInput):String
  resendVerificationCode(email:String):String
  }
  input Signupinput {
    email: String!
    password: String!
  }
  input verifyEmailInput {
    code:Int!
  }
  input updatePersonInput {
    country: String
    phone: String
    DOB: DateTime
    fullName: String
    occupation: String
  }
  input loginUserInput {
    email:String!
    password:String!
  }
  input resetPasswordInput {
    oldPassword:String!
    newPassword:String!
  }
  type loginResponse{
    token:String!
  }
  type SignupResponse {
    message:String!
    token:String
  }
`;
