"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = exports.Query = exports.Mutation = void 0;
const resolver_1 = require("./services/auth/resolver");
const Mutation = Object.assign({}, resolver_1.AuthMutation);
exports.Mutation = Mutation;
const Query = Object.assign({}, resolver_1.AuthQuery);
exports.Query = Query;
const Subscription = Object.assign({}, resolver_1.AuthSubscription);
exports.Subscription = Subscription;
