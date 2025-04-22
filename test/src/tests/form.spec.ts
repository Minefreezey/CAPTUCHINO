import { expect, test } from '@playwright/test';
import { LocatorFormPage } from '../pages/locatorform.spec';
import { TabFormPage } from '../pages/tabform.spec';
import testCase from '../test-data/testCase';


// test.describe("Input by locator", () => {
//     testCase.forEach((testData) => {
//         test.only(`locator typing : ${testData.fullName} `, async ({ page }) => {
//             const formPage = new LocatorFormPage(page);

//             await formPage.goto();
//             await formPage.fillFullName(testData.fullName, true);

//             //wait for 2 sec
//             await formPage.fillNumber(testData.number, true);
//         }
//         )
//     })

//     testCase.forEach((testData) => {
//         test.only(`locator paste : ${testData.fullName} `, async ({ page }) => {
//             const formPage = new LocatorFormPage(page);

//             await formPage.goto();
//             await formPage.fillFullName(testData.fullName, false);

//             //wait for 2 sec
//             await formPage.fillNumber(testData.number, false);
//         }
//         )
//     })
// })


test.describe("Input by tab", () => {
    testCase.forEach((testData) => {
        test.only(`tab typing : ${testData.fullName} `, async ({ page }) => {
            const formPage = new TabFormPage(page);

            await formPage.goto();
            await formPage.firstClick();
            await formPage.fillFullName(testData.fullName, true);
            await page.keyboard.press('Tab');
            await formPage.fillMonth(testData.month, true);
            await formPage.fillDate(testData.date, true);
            await formPage.fillYear(testData.year, true);
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            //wait for 2 sec
            await formPage.fillNumber(testData.number, true);
            await page.keyboard.press('Tab');
            await formPage.fillOtp(testData.otp, true);
            expect(checkUrl(page.url())).toBe(true);

        }
        )
    })

    testCase.forEach((testData) => {
        test.only(`tab paste : ${testData.fullName} `, async ({ page }) => {
            const formPage = new TabFormPage(page);

            await formPage.goto();
            await formPage.firstClick();
            await formPage.fillFullName(testData.fullName, false);
            await page.keyboard.press('Tab');
            await formPage.fillMonth(testData.month, false);
            await formPage.fillDate(testData.date, false);
            await formPage.fillYear(testData.year, false);
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            //wait for 2 sec
            await formPage.fillNumber(testData.number, false);
            await page.keyboard.press('Tab');
            await formPage.fillOtp(testData.otp, false);

            expect(checkUrl(page.url())).toBe(true);
        }
        )
    })


})
