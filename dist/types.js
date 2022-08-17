"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./services/auth/types");
const apollo_server_express_1 = require("apollo-server-express");
const linkSchemas = (0, apollo_server_express_1.gql) `
    scalar DateTime
    scalar JSON
   
  type Mutation {
    _: Boolean
  }
  type Query {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;
exports.default = [linkSchemas, types_1.authTypes];
