import { Query, Mutation, Subscription } from "./resolvers";
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from'graphql-type-json';
import typeDefs from"./types";

const resolvers:any = {
  Subscription,
  Query,
  Mutation,
  JSON : GraphQLJSON ,
  DateTime : GraphQLDateTime ,
};

export  {
  typeDefs,
  resolvers,
};