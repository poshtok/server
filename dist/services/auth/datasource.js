"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../.././models/user"));
const person_1 = __importDefault(require("../.././models/person"));
const apollo_server_express_1 = require("apollo-server-express");
const base_1 = __importDefault(require("../../base"));
const crypto_1 = __importDefault(require("crypto"));
const generateToken_1 = __importDefault(require("../../utils/lib/generateToken"));
const expireTime_1 = __importStar(require("../../utils/lib/expireTime"));
class AuthDataSource extends base_1.default {
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = data;
                if (!email && !password) {
                    throw new apollo_server_express_1.UserInputError("input values are required");
                }
                const user = yield user_1.default.findOne({ email });
                if (user)
                    throw new apollo_server_express_1.UserInputError("email, already exist");
                const emailCode = yield this.getCodeNumber();
                let account = yield user_1.default.create({
                    email,
                    password,
                    emailVerificationCode: emailCode,
                    emailVerificationExpires: (0, expireTime_1.default)(10),
                });
                yield person_1.default.create({ user: account._id });
                this.sendMail(account.email, "Welcome To PoshTok", "welcome", {
                    name: account.email.split("@")[0],
                    message: `Your Poshtok account has been created, use the code below to verify your email`,
                    code: emailCode,
                });
                return {
                    message: "Successfully created an Account",
                    token: (0, generateToken_1.default)(account),
                };
            }
            catch (err) {
                return { message: err.message };
            }
        });
    }
    loginUser({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const NotFound = "Invalid login credentials";
            const user = yield user_1.default.findOne({ email });
            if (!user)
                throw new apollo_server_express_1.UserInputError(NotFound);
            const isPass = yield user_1.default.comparePassword(user.password, password);
            if (!isPass)
                throw new apollo_server_express_1.UserInputError(NotFound);
            return { token: (0, generateToken_1.default)(user) };
        });
    }
    updatePerson(data, person) {
        return __awaiter(this, void 0, void 0, function* () {
            const NotFound = "Unable to validate authenticated account";
            const user = yield user_1.default.findById(person._id);
            if (!user)
                throw new apollo_server_express_1.AuthenticationError(NotFound);
            let foundPerson = yield person_1.default.findOne({ user: user._id });
            if (!foundPerson) {
                yield person_1.default.create(Object.assign(Object.assign({}, data), { user: user._id }));
                return "updates successful";
            }
            yield person_1.default.findOneAndUpdate({ user: user._id }, Object.assign({}, data));
            return "updates successful";
        });
    }
    forgotPassword(email, origin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!origin)
                throw new Error(`expected origin but got ${origin}`);
            const account = yield user_1.default.findOne({ email });
            if (!account)
                throw new apollo_server_express_1.UserInputError("Email not registered with us");
            const token = crypto_1.default.randomBytes(20).toString("hex");
            yield account.save();
            const url = `${origin}/reset/${token}`;
            const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account is its you kindly or follow this link ${url} or click the button `;
            this.sendMail(account.email, "Reset your PoshTok password", "code1111", { message, url });
            return account._id;
        });
    }
    resetPassword(data, origin) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield user_1.default.findOne({
                resetPasswordToken: data.token,
                resetPasswordExpires: { $gt: new Date() },
            });
            if (!account)
                throw new apollo_server_express_1.UserInputError("Password reset token is invalid or has expired.");
            account.password = data.password;
            account.resetPasswordToken = undefined;
            account.resetPasswordExpires = undefined;
            const message = "Your password was Update successfully, if this was not you kindly request for a new password update";
            const url = `${origin}/dashboard`;
            this.sendMail(account.email, "Password Updated", "code11111", { message, url });
            return "tokens";
        });
    }
    updatePassword({ oldPassword, newPassword }, person) {
        return __awaiter(this, void 0, void 0, function* () {
            const NotFound = "User not found";
            const user = yield user_1.default.findById({ _id: person._id });
            if (!user)
                throw new apollo_server_express_1.UserInputError(NotFound);
            let isPassword = yield user_1.default.comparePassword(user.password, oldPassword);
            if (!isPassword)
                throw new apollo_server_express_1.UserInputError(NotFound);
            user.password = newPassword;
            yield user.save();
            return "updates successful";
        });
    }
    verifyEmail({ code }, person) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isFound = yield user_1.default.findOne({ _id: person._id });
                let isFoundPerson = yield person_1.default.findOne({ user: person._id });
                if (isFoundPerson.emailVerified) {
                    return "Account Already verified";
                }
                if (isFound.emailVerificationCode === code &&
                    (0, expireTime_1.isExpired)(isFound.emailVerificationExpires)) {
                    return new apollo_server_express_1.AuthenticationError("code Expired");
                }
                if (isFound.emailVerificationCode === code &&
                    (0, expireTime_1.isExpired)(isFound.emailVerificationExpires) === false) {
                    isFound.emailVerificationCode = undefined;
                    isFound.emailVerificationExpires = undefined;
                    yield isFound.save();
                    yield person_1.default.findOneAndUpdate({ user: person._id }, { emailVerified: true });
                    return "Email Verified";
                }
                else if (isFound.emailVerificationCode !== code) {
                    return new apollo_server_express_1.UserInputError("incorrect Code");
                }
                else {
                    return "user not found";
                }
            }
            catch (e) {
                console.log(e.message);
                return "Internal Server Error";
            }
        });
    }
    resendVerificationCode({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            let isFound = yield user_1.default.findOne({ email });
            if (!isFound) {
                return new apollo_server_express_1.UserInputError("email address not registered");
            }
            let isVerified = yield person_1.default.findOne({
                user: isFound._id,
                emailVerified: true,
            });
            if (isVerified) {
                return "Account Already Verified";
            }
            const emailCode = yield this.getCodeNumber();
            yield user_1.default.findOneAndUpdate({ _id: isFound._id }, {
                emailVerificationCode: emailCode,
                emailVerificationExpires: (0, expireTime_1.default)(10),
            });
            this.sendMail(isFound.email, "Welcome To PoshTok", "welcome", {
                name: isFound.email.split("@")[0],
                message: `Your Poshtok account has been created, use the code below to verify your email`,
                code: emailCode,
            });
            return "code resent";
        });
    }
}
exports.default = AuthDataSource;
