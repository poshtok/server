import { authTypes } from "./services/auth/types";
import { PostTypes } from "./services/posts/types";
import { gql } from "apollo-server-express";

const linkSchemas = gql`
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

export default [linkSchemas,authTypes,PostTypes];