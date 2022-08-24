import { gql } from "apollo-server-express";

export const authTypes = gql`
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
