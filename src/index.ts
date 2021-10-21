import puppeteer from 'puppeteer';
import { waitForNavigation, checkIfTextExistsInAPage } from './helper';

(async function () {
    const browser = await puppeteer.launch({ headless: false })
    console.log('Checker started...');
    const url = "http://www.isere.gouv.fr/booking/create/14544";
    try {
        const page = await browser.newPage();
        console.log(`Visiting ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0' });
        page.setViewport({ height: 1920, width: 1080 });
        console.log(`${url} loaded Successfully`);
        await page.waitForSelector('#condition');
        const condition = await page.$('#condition');
        condition.click();
        const nextButton = await page.$('input[name="nextButton"]');
        nextButton.click();
        await ignoreUnsecuredConnection(page, '#fchoix_Booking').catch(console.log);
        await waitForNavigation(page, 10000, '#planning35227');
        console.log(`DEMANDE DE RENDEZ-VOUS loaded Successfully`);
        const matinOption = await page.$('#planning35227');
        matinOption.click();
        const firstStepNextButton = await page.$('input[name="nextButton"]');
        firstStepNextButton.click();
        await ignoreUnsecuredConnection(page).catch(console.log);
        const noSchedule = await checkIfTextExistsInAPage(page, `Il n'existe plus de plage horaire libre pour votre demande de rendez-vous. Veuillez recommencer ultérieurement.`);
        if (!noSchedule) {
            console.log('Schedule available');
        } else {
            console.log('No Schedule found');
        }
    } catch (err) {
        console.log('Chaining error');
        console.log(err);
    }
}())

async function ignoreUnsecuredConnection(page: puppeteer.Page, selector?: string) {
    await waitForNavigation(page, 10000, '#proceed-button', selector);
    if (await page.$('#proceed-button') !== null) {
        await page.click('#proceed-button');
    }
}