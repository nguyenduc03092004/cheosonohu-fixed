import fs from 'fs';
import datas from './readUsers.mjs';
let users = []
for (let i = 0; i < datas.length; i++) {
    if (datas[i] == 'lamnhatle') {
        users.push({
            id: i + 1,
            userName: datas[i].replace(',', '').trim(),
            passWord: 'nhatle123'
        })
    } else {
        users.push({
            id: i + 1,
            userName: datas[i].replace(',', '').trim(),
            passWord: '123456hg'
        })
    }

}
// console.log(users)
export default users