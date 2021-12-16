import fs from "fs";

export const asyncWrite = (path, data) => {
    return new Promise((resolve) => {
        fs.writeFile(path, data, (e) => {
            if (e) console.error(e);
            console.log(path + " written")
            resolve()
        });
    })
}
