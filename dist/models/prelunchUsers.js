"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const prelunchUserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        index: true,
        require: true
    },
    fullName: {
        type: String,
        require: true
    },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("prelunchuser", prelunchUserSchema);
