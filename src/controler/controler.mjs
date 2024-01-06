import puppeteer from "puppeteer";
import users from "../../user.mjs";
import fs from 'fs'
let count = 0;
let browser;
let googlePage
let page2;
let moneyNeed = 40; // số tiền còn thiếu của số hiện tại
let balance; // so du
let curNumber = 0; // so xo so
let curNumberString;
const pay = async (money) => { // xu ly thanh toan 1 hoac 2 chu so
    if (money < 10 && money != 0) {
        await inputNumber(money)
    } else {
        let saveValue = money
        let b = saveValue % 10
        let a = Math.floor(saveValue / 10)
        await inputNumber(a);
        await inputNumber(b);
    }

}

const clickNumber = async () => { // click vao so so xo
    if (curNumber < 10) {
        curNumberString = `0${curNumber}`
    } else {
        curNumberString = curNumber.toString();
    }
    await page2.waitForXPath(`//div[@class="mixBetBtnx3" and text()="${curNumberString}"]`);
    const divElement1 = await page2.$x(`//div[ @class="mixBetBtnx3" and text()="${curNumberString}"]`);
    await divElement1[0].click();
}


const getHomePage = async (req, res) => {
    if (curNumber == 100 && count == users.length - 1) {
        res.redirect('/done')
    }
    browser = await puppeteer.launch({ timeout: 10000000, args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false })
    googlePage = await browser.newPage();
    await googlePage.setViewport({ width: 1600, height: 900 })
    await googlePage.goto('https://nohu82.com');
    // await googlePage.waitForSelector('.btn.btn-link');
    // await googlePage.click('.btn.btn-link');
    // await googlePage.waitForSelector('.ng-scope span[ng-click="$ctrl.ok()"][translate="Common_Closed"]');
    // await googlePage.click('.ng-scope span[ng-click="$ctrl.ok()"][translate="Common_Closed"]');
    await googlePage.evaluate(() => {
        const button = document.querySelector('button[ng-click="$ctrl.openLoginModal()"]');
        const clickEvent = new Event('click', { bubbles: true });
        button.dispatchEvent(clickEvent);
    });
    await googlePage.waitForTimeout(1000)
    await googlePage.type('input[ng-model="$ctrl.user.account.value"]', users[count].userName)
    await googlePage.type('input[ng-model="$ctrl.user.password.value"]', users[count].passWord)
    await googlePage.type('input[ng-model="$ctrl.code"]', "")
    await googlePage.waitForTimeout(1000)
    await getCaptChaPage(req, res);


}

const inputNumber = async (n) => {
    if (n !== 0) {
        await page2.waitForSelector('.keyboardNBBtn');
        const element = await page2.$x(`//div[@class='keyboardNBBtn' and text()='${n}']`)
        await element[0].click();
    } else {
        await page2.waitForSelector('.keyboardNBBtn.keyboardBtn0');
        await page2.click('.keyboardNBBtn.keyboardBtn0');
    }
}


const inputCaptcha = async (req, res) => {
    await googlePage.type('input[ng-model="$ctrl.code"]', req.body.capchaValue)
    await googlePage.waitForSelector('button[type="submit"][ng-disabled="$ctrl.loginPending"]');
    await googlePage.click('button[type="submit"][ng-disabled="$ctrl.loginPending"]');
    await googlePage.waitForSelector('.btn.btn-link');
    await googlePage.click('.btn.btn-link');
    await googlePage.waitForSelector('.ng-scope span[ng-click="$ctrl.ok()"][translate="Common_Closed"]');
    await googlePage.click('.ng-scope span[ng-click="$ctrl.ok()"][translate="Common_Closed"]');
    page2 = await browser.newPage()
    await page2.setViewport({ width: 1600, height: 900 })
    await page2.goto('https://nohu82.com/Account/LoginToSupplier?SupplierType=Tp&gid=1568')
    await page2.waitForSelector('.UI_SettingCloseBtn', { timeout: 10000000 });
    await page2.click('.UI_SettingCloseBtn');
    //thuat toan de chon so cho moi acc

    //click Đuôi
    await page2.waitForXPath('//div[contains(@class, "betBtn_x2") and .//span[text()="Đuôi"]]', { clickable: true });
    const divElement = await page2.$x('//div[contains(@class, "betBtn_x2") and .//span[text()="Đuôi"]]');
    await page2.waitForTimeout(500)
    if (divElement) {
        await divElement[0].click();
    } else {
        console.log("k tt");
    }
    // lay so du hien tai cua acc
    await page2.waitForSelector('.txtBlue');
    balance = await page2.$eval('.txtBlue', element => element.textContent);
    balance = Math.floor(Number(balance))
    console.log('balance', balance)
    //click vao so xo so
    await clickNumber();

    //click den trang input
    await page2.waitForSelector('.TicketCheckBtn.active');
    await page2.click('.TicketCheckBtn.active');


    // input so du va nhap
    if (balance >= moneyNeed) {
        pay(moneyNeed);
        // await page2.waitForSelector('.keyboardOPBtn.keyboardBtnBet'); // bat len la mat tien
        // await page2.waitForTimeout(500)
        // await page2.click('.keyboardOPBtn.keyboardBtnBet');     // bat len la mat tien
        fs.appendFileSync('./results.txt', `count : ${count} ,account : ${users[count].userName} , so xo so : ${curNumber} , so tien : ${moneyNeed}  \n \n \n `);
        moneyNeed = 40; // số tiền mặc định mỗi số
        curNumber++;
    } else {
        pay(balance);
        // await page2.waitForSelector('.keyboardOPBtn.keyboardBtnBet'); // bat len la mat tien
        // await page2.waitForTimeout(500)
        // await page2.click('.keyboardOPBtn.keyboardBtnBet');    // bat len la mat tien
        fs.appendFileSync('./results.txt', `count : ${count} ,account : ${users[count].userName} , so xo so : ${curNumber} , so tien : ${balance}  \n `);
        moneyNeed = moneyNeed - balance;
        count++;
    }


    res.redirect('/')
}



const getCaptChaPage = async (req, res) => {
    let imgSrc = await googlePage.$eval('img.dVSNlKsQ1qaz1uSto7bNM', img => img.getAttribute('src'));
    imgSrc = imgSrc.toString().replace('data:image/png;base64,', '')
    res.render('fillCapcha', { valueImage: imgSrc })
}


const Controler = {
    inputCaptcha: inputCaptcha,
    getHomePage: getHomePage,
    getCaptChaPage: getCaptChaPage,
}

export default Controler