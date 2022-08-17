import { gql } from "apollo-server-express";

export const authTypes = gql`
  extend type Mutation {
    signup(data: Signupinput): String
    updateUserProfile(data: userUpdateProfileInput): String
  }

  input Signupinput {
    email: String
    password: String
  }
  input userUpdateProfileInput {
    country: String
    phone: String
    DOB: DateTime
    fullName: String
    occupation: String
  }
`;
