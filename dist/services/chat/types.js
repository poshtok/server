"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const PostTypes = (0, apollo_server_express_1.gql) `
extends type Mutation {
    createpost(data:createPostInput):UcreatepostResponse
}
#  extends type Query {
#  }

input createPostInput {
    description:string
    file:string
}

type createpostResponse {
      filename: String!
      mimetype: String!
      encoding: String!
      url: String!
    }

`;
exports.default = PostTypes;
