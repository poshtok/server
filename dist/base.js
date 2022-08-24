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
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs = __importStar(require("ejs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ids = require("short-id");
class Base {
    sendMailConfig() {
        const mailConfig = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        };
        return nodemailer_1.default.createTransport(mailConfig);
    }
    getCodeNumber(name, model, objectName = "code") {
        return __awaiter(this, void 0, void 0, function* () {
            let code;
            let codeCheck;
            do {
                code = ids.generate();
                codeCheck = yield model.findOne({ [objectName]: `${name}${code}` });
            } while (codeCheck);
            return `${name}${code}`;
        });
    }
    getTemplate(templateName, data) {
        const selection = {
            welcome: templateName === "welcome" &&
                fs
                    .readFileSync(path.join(process.cwd(), "src", "utils", "emailTemplate", "welcome.ejs"))
                    .toString(),
            activation: templateName === "activation" &&
                fs
                    .readFileSync(path.join(process.cwd(), "src", "utils", "emailTemplate", "activation.ejs"))
                    .toString(),
            invoice: templateName === "invoice" &&
                fs
                    .readFileSync(path.join(process.cwd(), "src", "utils", "emailTemplate", "invoice.ejs"))
                    .toString(),
        };
        if (!Object.keys(selection).includes(templateName))
            throw new Error(`Unknown email template type expected one of ${JSON.stringify(Object.keys(selection))} but got ${templateName}`);
        let template = ejs.compile(selection[templateName], {});
        return template(data);
    }
    sendMail(to, subject, TemplateName, data, from, html) {
        const info = {
            from: from ? from : '"PoshTok" <no-reply@poshtok.com>',
            to,
            subject: subject.toUpperCase(),
            html: this.getTemplate(TemplateName.toLowerCase(), data),
        };
        this.sendMailConfig()
            .sendMail(info)
            .then((info) => {
            console.log(`Sent -> ${info.response} `);
        })
            .catch((e) => {
            console.error(e, `Error ending email to ${to}`);
        });
    }
}
exports.default = Base;
