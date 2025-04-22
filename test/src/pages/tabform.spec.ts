
import { Page } from "@playwright/test";

export class TabFormPage {
    baseUrl = "http://localhost:5173";

    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.baseUrl);
    }

    async fillWithRandom(value: string) {
        for (let i = 0; i < value.length; i++) {
            await this.page.keyboard.type(value[i]);
            const random = Math.floor(Math.random() * 200) + 100; // Random delay between 300ms and 2000ms
            await this.page.waitForTimeout(random);
        }
    }

    async firstClick() {
        await this.page.locator('input[name="fullname"]').first().click();
    }

    async fillFullName(name: string, rand: boolean) {
        if (rand) {
            await this.fillWithRandom(name);
        } else {
            await this.page.keyboard.type(name);
        }
    }

    async fillNumber(number: string, rand: boolean) {
        if (rand) {
            await this.fillWithRandom(number);
        }
        await this.page.keyboard.type(number);
    }

    async fillDate(date: string, rand: boolean) {
        if (rand) {
            await this.fillWithRandom(date);
        }
        await this.page.keyboard.type(date);
    }
    async fillMonth(month: string, rand: boolean) {
        if (rand) {
            await this.fillWithRandom(month);
        }
        await this.page.keyboard.type(month);
    }
    async fillYear(year: string, rand: boolean) {
        if (rand) {
            await this.fillWithRandom(year);
        }
        await this.page.keyboard.type(year);
    }
    async fillOtp(otp: string, rand: boolean) {
        if (rand) {
            await this.fillWithRandom(otp);
        }
        await this.page.keyboard.type(otp);
    }


}