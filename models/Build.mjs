import fs from "fs";
import {Message} from "./Message.mjs";

export class Build {
    constructor() {
        this.done = Message.getAll().then(async (msgs) => {
            await Build.createPages(msgs);
            await Build.createIndex(msgs);
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
        const slugs = [...msgs].reverse().map(m => {
            return `<li><a href="./build/${m.id}.html">${m.subject}</a><br/><small>${m.date.toLocaleString()}</small></li>`
        }).join('\n');

        const innerHTML = `
        <h1>Generated Email Blog</h1>
        <h2>Table of Contents</h2>
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
</head>
<body>
${html}
</body>
</html>
        `
    }
}
