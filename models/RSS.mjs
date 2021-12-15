import { Feed } from "feed";



export class RSS {
    static buildMain = async (msgs) => {
        const feed = new Feed({
            title: "Feed Title",
            description: "This is my personal feed!",
            id: "http://example.com/",
            link: "http://example.com/",
            language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "http://example.com/image.png",
            favicon: "http://example.com/favicon.ico",
            copyright: "All rights reserved 2013, John Doe",
            generator: "awesome", // optional, default = 'Feed for Node.js'
            feedLinks: {
                json: "https://example.com/json",
                atom: "https://example.com/atom"
            },
            author: {
                name: "John Doe",
                email: "johndoe@example.com",
                link: "https://example.com/johndoe"
            }
        });

        msgs.forEach(m => {
            feed.addItem({
                title: m.subject || "(no subject)",
                id: m.id,
                link: `/build/${m.id}.html`,
                description: m.text,
                content: m.toHTML(),
                author: [
                    {
                        name: m.fromName,
                        email: m.fromEmail
                    }
                ],
                date: m.date,
                image: m.image()
            });
        });

        console.log(feed)
    }
}
