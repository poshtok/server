"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSubscription = exports.AuthQuery = exports.AuthMutation = void 0;
const AuthQuery = {};
exports.AuthQuery = AuthQuery;
const AuthMutation = {
    signup: (root, { data }, { dataSources, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { AuthDataSource } = dataSources;
        return yield new AuthDataSource().signup(data);
    }),
    loginUser: (root, { data }, { dataSources, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { AuthDataSource } = dataSources;
        return yield new AuthDataSource().loginUser(data);
    }),
    updatePerson: (root, { data }, { dataSources, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { AuthDataSource } = dataSources;
        return yield new AuthDataSource().updatePerson(data);
    }),
    forgotPassword: (root, { data }, { dataSources, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { AuthDataSource } = dataSources;
        return yield new AuthDataSource().forgotPassword(data);
    }),
    resetPassword: (root, { data }, { dataSources, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { AuthDataSource } = dataSources;
        return yield new AuthDataSource().resetPassword(data);
    }),
    verifyEmail: (root, { data }, { dataSources, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { AuthDataSource } = dataSources;
        return yield new AuthDataSource().verifyEmail(data, req.user);
    }),
    resendVerificationCode: (root, data, { dataSources, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
        const { AuthDataSource } = dataSources;
        return yield new AuthDataSource().resendVerificationCode(data);
    }),
};
exports.AuthMutation = AuthMutation;
const AuthSubscription = {};
exports.AuthSubscription = AuthSubscription;
