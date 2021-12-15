import checkMessages from './checkMessages.mjs';
import {Build} from "./models/Build.mjs";
import child_process from "child_process";

const main = async () => {
    await checkMessages();
    await new Build().done;
    child_process.exec(`git add -A && git commit -m "new build ${Date.now()}"`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    })

}

main().then(() => {
    setInterval(main, 1200000)
})
