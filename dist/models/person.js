"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PersonSchema = new mongoose_1.Schema({
    phone: {
        type: String,
        index: true
    },
    country: {
        type: String
    },
    fullName: {
        type: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId
    }
});
exports.default = (0, mongoose_1.model)("person", PersonSchema);
