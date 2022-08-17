"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const resolvers_1 = require("./resolvers");
const graphql_iso_date_1 = require("graphql-iso-date");
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const types_1 = __importDefault(require("./types"));
exports.typeDefs = types_1.default;
const resolvers = {
    Subscription: resolvers_1.Subscription,
    Query: resolvers_1.Query,
    Mutation: resolvers_1.Mutation,
    JSON: graphql_type_json_1.default,
    DateTime: graphql_iso_date_1.GraphQLDateTime,
};
exports.resolvers = resolvers;
