import nodemailer from "nodemailer";
import * as ejs from "ejs"
import { Model } from "mongoose";
import * as fs from "fs";
import * as path from "path";
const ids = require("short-id")
export default class Base {
    sendMailConfig() {
        const mailConfig = {
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        };
        return nodemailer.createTransport(mailConfig as object);
      }
      async getCodeNumber(
        name: string,
        model: Model<any>,
        objectName: string = "code"
      ) {
        let code;
        let codeCheck;
        do {
          code = ids.generate();
          codeCheck = await model.findOne({ [objectName]: `${name}${code}` });
        } while (codeCheck);
        return `${name}${code}`;
      }
      getTemplate(templateName: string, data: object) {
        const selection: { invoice: string | false; activation: string | false; welcome: string | false } =
          {
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
        html?:string | undefined
      ) {
        const info = {
          from: from ? from : '"PoshTok" <no-reply@poshtok.com>',
          // from: from ? from : 'sixtusiwuchukwu21@gmail.com',
          to,
          subject: subject.toUpperCase(),
          html: this.getTemplate(TemplateName.toLowerCase(), data),
        };
    
        this.sendMailConfig()
          .sendMail(info)
          .then((info) => {
            console.log(`Sent -> ${info.response} `);
            // console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
          })
          .catch((e) => {
            console.error(e, `Error ending email to ${to}`);
          });
      }
}