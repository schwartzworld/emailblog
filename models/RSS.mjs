import {asyncWrite} from "../util/FS.mjs";

const createEntry = ({ title, description, link, pubDate }) => `
<item>
  <title>${title}</title>
  <description>${description}</description>
  <link>${link}</link>
  <pubDate>${pubDate}</pubDate>
</item>
`

export const RSS = async (msgs = []) => {
    const entries = msgs.map(m => {
        return createEntry({
            title: m.subject || m.date.toUTCString(),
            description: m.text,
            link: `/build/${m.id}.html`,
            pubDate: m.date.toUTCString()
        });
    }).join('');
    asyncWrite("./rss.xml", `
    <rss version="2.0">
      <channel>
        <title>Generated Blog</title>
        <description>Description here</description>
        <link>http://schwartz.world/whatever</link>
        <copyright>Copyright 2021, Ian Schwartz</copyright>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <webMaster>ian@schwartz.world</webMaster>
        <generator>My own damn software</generator>
        <image>
          <url>http://www.feedforall.com/ffalogo48x48.gif</url>
          <title>FeedForAll Sample Feed</title>
          <link>http://www.feedforall.com/industry-solutions.htm</link>
          <description>FeedForAll Sample Feed</description>
          <width>48</width>
          <height>48</height>
        </image>
        ${entries}
      </channel>
    </rss>
    `).then(() => console.log('rss done'))
}
/*
<rss version="2.0">
  <channel>
    <title>Generated Blog</title>
    <description>Description here</description>
    <link>http://schwartz.world/whatever</link>
    <copyright>Copyright 2021, Ian Schwartz</copyright>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <webMaster>ian@schwartz.world</webMaster>
    <generator>My own damn software</generator>
    <image>
      <url>http://www.feedforall.com/ffalogo48x48.gif</url>
      <title>FeedForAll Sample Feed</title>
      <link>http://www.feedforall.com/industry-solutions.htm</link>
      <description>FeedForAll Sample Feed</description>
      <width>48</width>
      <height>48</height>
    </image>
    <item>
      <title>${title}</title>
      <description>${description}</description>
      <link>${link}</link>
      <pubDate>${pubDate}</pubDate>
    </item>
  </channel>
</rss>
 */
