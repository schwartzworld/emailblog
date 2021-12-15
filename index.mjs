import checkMessages from './checkMessages.mjs';
import {Build} from "./models/Build.mjs";
import child_process from "child_process";

checkMessages().then(() => {
    const b = new Build();
    b.done.then(() => {
        child_process.exec(`git add -A && git commit -m "new build ${Date.now()}" && git push`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
        })
    })
})
