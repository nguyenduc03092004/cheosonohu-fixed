import fs from 'fs';
let datas
function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

datas = await readFileAsync('./listuser.doc')
datas = datas.split(',')
datas = datas.map((element) => { return element.trim() })


//console.log(datas)


export default datas