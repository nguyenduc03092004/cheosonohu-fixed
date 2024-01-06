import fs from 'fs'
let dataUsers;
let elementsSame = []
const readFile = (path) => {
    return new Promise((resolve) => {
        fs.readFile(path, 'utf8', (e, dataReaded) => {
            if (e) {
                console.log(e)
            }
            else {
                resolve(dataReaded)
            }
        })
    })
}
let check;
dataUsers = await readFile('./listuser.doc')
let dataToArr = dataUsers.split(',')
// console.log(dataToArr)
for (let i = 0; i < dataToArr.length; i++) {
    check = 0
    for (let j = 0; j < dataToArr.length; j++) {
        if (dataToArr[i] == dataToArr[j]) {
            check++
        };
        if (check >= 2 && !elementsSame.includes(dataToArr[i])) {
            elementsSame.push(dataToArr[i])
            break
        }
    }
}
console.log(elementsSame)