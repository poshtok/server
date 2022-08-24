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
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },
    password: { type: String, required: true },
}, {
    timestamps: true,
});
UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    const salt = (0, crypto_1.randomBytes)(16).toString("hex");
    user.password = `${(0, crypto_1.scryptSync)(user.password, salt, 32).toString("hex")}:${salt}`;
    return next();
});
UserSchema.statics.comparePassword = (storedPassword, userPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const [key, salt] = storedPassword.split(":");
    const userPass = (0, crypto_1.scryptSync)(userPassword, salt, 32).toString("hex");
    return userPass === key;
});
exports.default = (0, mongoose_1.model)("user", UserSchema);
