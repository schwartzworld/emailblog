import { Model, DataTypes } from 'sequelize';
import fs from 'fs';
import crypto from 'crypto';
import {sequelize} from "../sequelize.mjs";

class DBMessage extends Model {}

DBMessage.init({
    html: DataTypes.STRING,
    text: DataTypes.STRING,
    subject: DataTypes.STRING,
    date: DataTypes.DATE,
    fromName: DataTypes.STRING,
    fromEmail: DataTypes.STRING,
    toName: DataTypes.STRING,
    toEmail: DataTypes.STRING,
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    },
    attachment_id: DataTypes.STRING
}, { sequelize, modelName: 'message' });

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
        /*
        [
            {
                contentType: 'video/mp2t',
                fileName: 'index.ts',
                contentDisposition: 'attachment',
                transferEncoding: 'base64',
                contentId: 'f_kx7nf8ht0',
                generatedFileName: 'index.ts',
                checksum: '536a395659048a7b56f1ada5c98b179f',
                length: 429,
                content: <Buffer 2f 2f 20 74 73 6c 69 6e 74 3a 64 69 73 61 62 6c 65 0a 2f 2a 2a 0a 20 2a 20 77 68 6f 6c 65 73 61 6c 65 2d 6f 66 66 65 72 0a 20 2a 20 47 65 6e 65 72 61 ... 379 more bytes>
            }
        ]
        */
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
        const messages = await DBMessage.findAll();
        return messages.map(m => {
            return new Message(m.dataValues);
        })
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
