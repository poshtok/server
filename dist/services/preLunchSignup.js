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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prelunchUsers_1 = __importDefault(require("../models/prelunchUsers"));
const preSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName } = req.body;
    if (!email && !fullName) {
        return res.status(400).send("all fields are required");
    }
    try {
        yield prelunchUsers_1.default.create({ email, fullName });
        return res.status(200).send("sucess");
    }
    catch (error) {
        return res.status(500).send("internal server error");
    }
});
exports.default = preSignup;
