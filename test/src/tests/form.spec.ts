import { expect, test } from "@playwright/test";

import { LocatorFormPage } from "../pages/locatorform.spec";
import { TabFormPage } from "../pages/tabform.spec";
import { MouseMovementFormPage } from "../pages/mouesmovementform.spec";
import testCase from "../test-data/testCase";

// import { checkUrl } from '../../utils/utils';
function checkUrl(url: string) {
  let newUrl = url;
  const lastSegment = newUrl.split("/").pop();

  if (lastSegment === "success") {
    return false;
  } else if (lastSegment === "failed") {
    return true;
  } else {
    return false;
  }
}

test.describe("Input by locator", () => {
  testCase.forEach((testData) => {
    test.only(`locator typing : ${testData.fullName} `, async ({ page }) => {
      const formPage = new LocatorFormPage(page);

      await formPage.goto();
      await formPage.fillFullName(testData.fullName, true);

      //wait for 2 sec
      await formPage.fillNumber(testData.number, true);
      await formPage.fillOtp(testData.otp, true);

      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      expect(checkUrl(page.url())).toBe(true);
    });
  });

  testCase.forEach((testData) => {
    test.only(`locator paste : ${testData.fullName} `, async ({ page }) => {
      const formPage = new LocatorFormPage(page);

      await formPage.goto();
      await formPage.fillFullName(testData.fullName, false);

      //wait for 2 sec
      await formPage.fillNumber(testData.number, false);
      await formPage.fillOtp(testData.otp, false);

      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      expect(checkUrl(page.url())).toBe(true);
    });
  });
});

test.describe("Input by tab", () => {
  testCase.forEach((testData) => {
    test.only(`tab typing : ${testData.fullName} `, async ({ page }) => {
      const formPage = new TabFormPage(page);

      await formPage.goto();
      await formPage.firstClick();
      await formPage.fillFullName(testData.fullName, true);
      await page.keyboard.press("Tab");
      await formPage.fillMonth(testData.month, true);
      await formPage.fillDate(testData.date, true);
      await formPage.fillYear(testData.year, true);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      //wait for 2 sec
      await formPage.fillNumber(testData.number, true);
      await page.keyboard.press("Tab");
      await formPage.fillOtp(testData.otp, true);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      //wait for 2 sec
      await page.waitForTimeout(500);
      expect(checkUrl(page.url())).toBe(true);
    });
  });

  testCase.forEach((testData) => {
    test.only(`tab paste : ${testData.fullName} `, async ({ page }) => {
      const formPage = new TabFormPage(page);

      await formPage.goto();
      await formPage.firstClick();
      await formPage.fillFullName(testData.fullName, false);
      await page.keyboard.press("Tab");
      await formPage.fillMonth(testData.month, false);
      await formPage.fillDate(testData.date, false);
      await formPage.fillYear(testData.year, false);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      //wait for 2 sec
      await formPage.fillNumber(testData.number, false);
      await page.keyboard.press("Tab");
      await formPage.fillOtp(testData.otp, false);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);

      expect(checkUrl(page.url())).toBe(true);
    });
  });
});

test.describe("Input by mouse", () => {
  testCase.forEach((testData) => {
    test.only(` > mouse moving with straight line with typing : ${testData.fullName}`, async ({
      page,
    }) => {
      const formPage = new MouseMovementFormPage(page);

      await formPage.goto();
      await formPage.moveto({ x: 0, y: 0 }, { x: 510, y: 450 }, 272, true);
      await formPage.myClick();
      await formPage.fillWithFullName(testData.fullName, true);
      await formPage.moveto({ x: 510, y: 450 }, { x: 510, y: 590 }, 56, true);
      await formPage.myClick();
      await formPage.fillWithNumber(testData.number, true);
      await formPage.moveto({ x: 510, y: 590 }, { x: 510, y: 650 }, 24, true);
      await formPage.myClick();
      await formPage.fillWithOtp(testData.otp, true);
      await page.waitForTimeout(1200);
      await formPage.scrollWindow();
      await formPage.moveto({ x: 510, y: 650 }, { x: 510, y: 580 }, 28, true);
      await formPage.myClick();
      await page.waitForTimeout(1000);
      await formPage.moveto({ x: 510, y: 580 }, { x: 510, y: 610 }, 12, true);
      await formPage.myClick();
      await page.waitForTimeout(1000);
      await formPage.moveto({ x: 510, y: 610 }, { x: 510, y: 650 }, 16, true);
      await formPage.myClick();
      await page.waitForTimeout(500);

      expect(checkUrl(page.url())).toBe(true);
    });

    test.only(` > mouse moving with non-straight line with typing : ${testData.fullName}`, async ({
      page,
    }) => {
      const formPage = new MouseMovementFormPage(page);

      await formPage.goto();
      await formPage.moveto({ x: 0, y: 0 }, { x: 510, y: 450 }, 272, false);
      await formPage.myClick();
      await formPage.fillWithFullName(testData.fullName, true);
      await formPage.moveto({ x: 510, y: 450 }, { x: 510, y: 590 }, 56, false);
      await formPage.myClick();
      await formPage.fillWithNumber(testData.number, true);
      await formPage.moveto({ x: 510, y: 590 }, { x: 510, y: 650 }, 24, false);
      await formPage.myClick();
      await formPage.fillWithOtp(testData.otp, true);
      await page.waitForTimeout(1200);
      await formPage.scrollWindow();
      await formPage.moveto({ x: 510, y: 650 }, { x: 510, y: 580 }, 28, false);
      await formPage.myClick();
      await page.waitForTimeout(1000);
      await formPage.moveto({ x: 510, y: 580 }, { x: 510, y: 610 }, 12, false);
      await formPage.myClick();
      await page.waitForTimeout(1000);
      await formPage.moveto({ x: 510, y: 610 }, { x: 510, y: 650 }, 16, false);
      await formPage.myClick();
      await page.waitForTimeout(500);

      expect(checkUrl(page.url())).toBe(true);
    });

    test.only(` > mouse moving with non-straight line with copy-paste : ${testData.fullName}`, async ({
      page,
    }) => {
      const formPage = new MouseMovementFormPage(page);

      await formPage.goto();
      await formPage.moveto({ x: 0, y: 0 }, { x: 510, y: 450 }, 272, false);
      await formPage.myClick();
      await formPage.fillWithFullName(testData.fullName, false);
      await formPage.moveto({ x: 510, y: 450 }, { x: 510, y: 590 }, 56, false);
      await formPage.myClick();
      await formPage.fillWithNumber(testData.number, false);
      await formPage.moveto({ x: 510, y: 590 }, { x: 510, y: 650 }, 24, false);
      await formPage.myClick();
      await formPage.fillWithOtp(testData.otp, false);
      await page.waitForTimeout(1200);
      await formPage.scrollWindow();
      await formPage.moveto({ x: 510, y: 650 }, { x: 510, y: 580 }, 28, false);
      await formPage.myClick();
      await page.waitForTimeout(1000);
      await formPage.moveto({ x: 510, y: 580 }, { x: 510, y: 610 }, 12, false);
      await formPage.myClick();
      await page.waitForTimeout(1000);
      await formPage.moveto({ x: 510, y: 610 }, { x: 510, y: 650 }, 16, false);
      await formPage.myClick();
      await page.waitForTimeout(500);

      expect(checkUrl(page.url())).toBe(true);
    });

    test.only(` > mouse moving with straight line with copy-paste : ${testData.fullName}`, async ({
      page,
    }) => {
      const formPage = new MouseMovementFormPage(page);

      await formPage.goto();
      await formPage.moveto({ x: 0, y: 0 }, { x: 510, y: 450 }, 272, true);
      await formPage.myClick();
      await formPage.fillWithFullName(testData.fullName, false);
      await formPage.moveto({ x: 510, y: 450 }, { x: 510, y: 590 }, 56, true);
      await formPage.myClick();
      await formPage.fillWithNumber(testData.number, false);
      await formPage.moveto({ x: 510, y: 590 }, { x: 510, y: 650 }, 24, true);
      await formPage.myClick();
      await formPage.fillWithOtp(testData.otp, false);
      await page.waitForTimeout(1200);
      await formPage.scrollWindow();
      await formPage.moveto({ x: 510, y: 650 }, { x: 510, y: 580 }, 28, true);
      await formPage.myClick();
      await page.waitForTimeout(1000);
      await formPage.moveto({ x: 510, y: 580 }, { x: 510, y: 610 }, 12, true);
      await formPage.myClick();
      await page.waitForTimeout(1000);
      await formPage.moveto({ x: 510, y: 610 }, { x: 510, y: 650 }, 16, true);
      await formPage.myClick();
      await page.waitForTimeout(500);

      expect(checkUrl(page.url())).toBe(true);
    });
  });
});
