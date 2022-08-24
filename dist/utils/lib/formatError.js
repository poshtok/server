"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { AuthenticationError, UserInputError, ValidationError, ForbiddenError, } = require('apollo-server-express');
const ErrorFormat = (err) => {
    if (err.originalError instanceof AuthenticationError) {
        return err;
    }
    if (err.originalError instanceof UserInputError) {
        return err;
    }
    if (err.originalError instanceof ValidationError) {
        return err;
    }
    if (err.originalError instanceof ForbiddenError) {
        return err;
    }
    console.error(`Server Error: ${JSON.stringify(err, null, 1)}`);
    return new Error('Internal server error');
};
exports.default = ErrorFormat;
