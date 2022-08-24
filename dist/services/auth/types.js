"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTypes = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.authTypes = (0, apollo_server_express_1.gql) `
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
