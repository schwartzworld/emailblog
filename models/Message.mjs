import fs from 'fs';
import crypto from 'crypto';
import { sequelize, DBMessage } from "./db.mjs";

class Attachment {
    constructor(id, mimeType) {
        this.id = id;
        this.mimeType = mimeType;
        this.pathToFile = `../attachments/${id}`;
    }

    render = () => {
        if (this.id === null || !this.mimeType) {
            return "";
        }

        if (this.mimeType.includes('image')) {
            return `<img src="${this.pathToFile}" alt="${this.pathToFile}"/>`
        }

        if (this.mimeType.includes('audio')) {
            return `<audio
                controls
                src="${this.pathToFile}">
                Your browser does not support the
                <code>audio</code> element.
            </audio>`
        }

        return `<a href="${this.pathToFile}">${this.id}</a>`
    }
}

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
        attachment_mimetype = null,
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
        this.attachment_mimetype = attachment_mimetype;
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

        const attachment_mimetype = attachment.contentType
        const attachment_id = crypto.randomBytes(16).toString("hex");
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
            attachment_mimetype,
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
        return new Attachment(this.attachment_id, this.attachment_mimetype)
    }

    toHTML = () => {
        return `
<div>
    <h3>${this.subject}</h3>
    <small>sent by ${this.fromName}</small>
    <small>${this.date.toLocaleDateString()}</small>
    <div>
        {this.attachment().render()}
        <pre>
            ${this.text}
        </pre>
    </div>
</div>
`
    }
}
