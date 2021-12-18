import {Message} from "./Message.mjs";
import { RSS } from "./RSS.mjs";
import {asyncWrite} from "../util/FS.mjs";

export class Build {
    constructor(newMessages = []) {
        this.done = Message.getAll().then(async (msgs) => {
            await Build.createPages(msgs);

            await Build.createIndex(msgs);
            const feed = await RSS(msgs);
        })
    }

    static createPages = async (msgs = []) => {
        return Promise.all(msgs.map(m => {
            return asyncWrite(`./build/${m.id}.html`, Build.wrapper('a site', m.toHTML()))
        }));
    }

    static createIndex = (msgs = []) => {
        const reversed = [...msgs].reverse();
        const [first, ...rest] = reversed;
        if (first instanceof Message) {

            const slugs = rest.map(m => {
                return `<li><a href="./build/${m.id}.html">${m.subject || "(no subject)"}</a><br/><small>${m.date.toLocaleString()}</small></li>`
            }).join('\n');

            const innerHTML = `
            <h1>Generated Email Blog</h1>
            ${first.toHTML(true)}
            <h3>Archive</h3>
            <ul>
                ${slugs}
            </ul>
            `
            return asyncWrite("./index.html", Build.wrapper("Index", innerHTML))
        }
    }

    static wrapper = (title, html) => {
        return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${title}</title>
<link rel="stylesheet" href="/tufte.css">
<style>
    img {
        max-width: 90%;
    }
    .preview {
        max-width: 20rem;
    }
</style>
</head>
<body>
${html}
</body>
</html>
        `
    }
}
