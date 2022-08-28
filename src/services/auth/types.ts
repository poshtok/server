import { gql } from "apollo-server-express";

export const authTypes = gql`
  extend type Mutation {
    signup(data: Signupinput): SignupResponse
    loginUser(data: loginUserInput): loginResponse
    updatePerson(data: updatePersonInput): fewUserResponse
    forgotPassword(email: String): String
    resetPassword(data: resetPasswordInput): String
    verifyEmail(data: verifyEmailInput): String
    resendVerificationCode(email: String): String
    follow(userId:ID):String
    unFollow(userId:ID):String
  }
  extend type Query {
    isFollowing(userId:ID):Boolean
    friendsToFollow(data: [String]): [friendToFollowResponse]
    getCurrentUser:person
    getFollowers:[fewUserResponse]
    getFollowing:[fewUserResponse]
    getUserFollowers(userId:ID):[fewUserResponse]
    getUserFollowing(userId:ID):[fewUserResponse]
    getUser(userId:ID):person
  }
  input Signupinput {
    email: String!
    password: String!
  }
  input verifyEmailInput {
    code: Int!
  }
  input updatePersonInput {
    country: String
    phone: String
    DOB: String
    fullName: String
    userName:String
    occupation: String
  }
  input loginUserInput {
    email: String!
    password: String!
  }
  input resetPasswordInput {
    oldPassword: String!
    newPassword: String!
  }
  input friendToFollowInput {
    phone: String
  }
  type fewUserResponse {
    fullName:String
    userName:String
    avater:String
    _id:ID
  }
  type person {
    phone:String
    country:String
    fullName:String
    userName:String
    DOB:String
    bio:String
    _id:ID
    avater:String
    email:String
    emailVerified:Boolean
    interests:[ID!]
    following:Int
    followers:Int
}
  type loginResponse {
    token: String!
    userInfo:fewUserResponse
  }
  type SignupResponse {
    message: String!
    token: String
  }
  type friendToFollowResponse {
    _id: ID
    avater: String
    fullName: String
    userName: String
  }
`;
