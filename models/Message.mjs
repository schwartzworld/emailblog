import fs from 'fs';
import crypto from 'crypto';
import { sequelize, DBMessage } from "./db.mjs";

export class Message {
    constructor({
        html,  // encodedstring
        text, // string
        date, // Date obj
        subject, // string
        fromName,
        fromEmail,
        toName,
        toEmail,
        attachment_id = null,
        id,
    }) {
        this.html = html;
        this.text = text;
        this.date = date;
        this.subject = subject;
        this.fromName = fromName;
        this.fromEmail = fromEmail;
        this.toName = toName;
        this.toEmail = toEmail;
        this.attachment_id = attachment_id;
        this.id = id;
    }

    imagePath = () => this.attachment_id ? `../attachments/${this.attachment_id}` : null;
    static create({
        html,  // htmlstring
        text, // string
        date,
        subject = "", // string
        from: [{ address: fromEmail, name: fromName }], // [{ address: string, name: string }]
        to: [{ address: toEmail, name: toName }], // [{ address: string, name: string }]
        attachments = []
    }) {
        const attachment = attachments[0];
        const split = attachment.generatedFileName.split('.')
        const extension = split[split.length - 1];
        const attachment_id = `${crypto.randomBytes(16).toString("hex")}.${extension}`;
        const data = {
            html: encodeURIComponent(html),
            text,
            date: new Date(date),
            subject,
            fromName,
            fromEmail,
            toEmail,
            toName,
            attachment_id,
        };

        sequelize.sync().then(async () => {
            const msg = await DBMessage.create(data).then(() => {
                fs.writeFile('./attachments/' + attachment_id, attachment.content, (e) => {
                    if (e) console.error(e);
                    console.log(attachment_id + " saved.");
                })
            });
        });
        return new Message(data)
    }

    static getAll = async () => {
        await sequelize.sync()
        const messages = await DBMessage.findAll();
        return messages.map(m => {
            return new Message(m.dataValues);
        })
    }

    attachment = () => {
        return new Attachment(this.attachment_id)
    }

    toHTML = () => {
        return `
<div>
    <h3>${this.subject}</h3>
    <small>sent by ${this.fromName}</small>
    <small>${this.date.toLocaleDateString()}</small>
    <div>
        <img src="${this.imagePath()}" alt="${this.imagePath()}" />
        <pre>
            ${this.text}
        </pre>
    </div>
</div>
`
    }
}
