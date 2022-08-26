import nodemailer from "nodemailer";
import * as ejs from "ejs";
import { Model } from "mongoose";
import * as fs from "fs";
import * as path from "path";
import { SentMessageInfo } from "nodemailer/lib/ses-transport";
import { AuthenticationError } from "apollo-server-express";
const ids = require("short-id");
const mailgun = require("mailgun-js");
// const mg = 
export default class Base {
  async isLoggedin(user:any){
    if(user === undefined){
      throw new AuthenticationError("login to continue")
    }
  }
  sendMailConfig() {
    const mailConfig = {
        apiKey: process.env.EMAIL_APIKEY,
        domain: process.env.EMAIL_DOMAIN,
    };
    return mailgun(mailConfig as object);
  }
  async getCodeNumber() {
    return Math.floor(1000 + Math.random() * 9000)
  }
  getTemplate(templateName: string, data: object) {
    const selection: {
      invoice: string | false;
      activation: string | false;
      welcome: string | false;
    } = {
      welcome:
        templateName === "welcome" &&
        fs
          .readFileSync(
            path.join(
              process.cwd(),
              "src",
              "utils",
              "emailTemplate",
              "welcome.ejs"
            )
          )
          .toString(),
      activation:
        templateName === "activation" &&
        fs
          .readFileSync(
            path.join(
              process.cwd(),
              "src",
              "utils",
              "emailTemplate",
              "activation.ejs"
            )
          )
          .toString(),
      invoice:
        templateName === "invoice" &&
        fs
          .readFileSync(
            path.join(
              process.cwd(),
              "src",
              "utils",
              "emailTemplate",
              "invoice.ejs"
            )
          )
          .toString(),
    };
    if (!Object.keys(selection).includes(templateName))
      throw new Error(
        `Unknown email template type expected one of ${JSON.stringify(
          Object.keys(selection)
        )} but got ${templateName}`
      );
    let template = ejs.compile(
      selection[templateName as keyof typeof selection] as string,
      {}
    );
    return template(data);
  }

  sendMail(
    to: string,
    subject: string,
    TemplateName: string,
    data?: any,
    from?: string,
    html?: string | undefined
  ) {
    const info = {
      from: from ? from : '"PoshTok" <no-reply@poshtok.com>',
      to,
      subject: subject.toUpperCase(),
      html: this.getTemplate(TemplateName.toLowerCase(), data),
    };

    this.sendMailConfig()
      .messages().send(info)
      .then((info: SentMessageInfo | SentMessageInfo) => {
        console.log(`Sent ->`);
      })
      .catch((e: any) => {
        console.error(e, `Error sending email to ${to}`);
      });
  }
 
}
