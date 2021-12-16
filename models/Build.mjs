import fs from "fs";
import {Message} from "./Message.mjs";
import { RSS } from "./RSS.mjs";

export class Build {
    constructor(newMessages = []) {
        this.done = Message.getAll().then(async (msgs) => {
            console.log(msgs.length)
            await Build.createPages(msgs);
            await Build.createIndex(msgs);
            const feed = await RSS(msgs);
            console.log(JSON.stringify(feed, null, '\t'))
        })
    }

    static createPages = async (msgs = []) => {
        return Promise.all(msgs.map(m => {
            return new Promise(res => {
                fs.writeFile(`./build/${m.id}.html`, Build.wrapper('a site', m.toHTML()), (e) => {
                    if (e) console.error(e);
                    console.log(`${m.id}.html saved`);
                    res();
                })
            })
        }));
    }

    static createIndex = (msgs = []) => {
        const reversed = [...msgs].reverse();
        const [first, ...rest] = reversed;
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

        return new Promise(res => {
            fs.writeFile("./index.html", Build.wrapper("Index", innerHTML), (e) => {
                if (e) console.error(e);
                console.log(`index done with ${slugs.length} links`)
                res();
            })
        })
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
