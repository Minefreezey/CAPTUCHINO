
import { Page } from "@playwright/test";

export class LocatorFormPage {
    baseUrl = "http://localhost:5173/form";

    locatorFullName = 'input[name="fullname"]';
    locatorNumber = 'input[name="number"]';
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.baseUrl);
    }

    async fillWithRandom(locatorName: string, value: string){
        for(let i = 0; i < value.length; i++) {
            await this.page.locator(locatorName).first().press(value[i]);
            const random = Math.floor(Math.random() * 200) + 100; // Random delay between 300ms and 2000ms
            await this.page.waitForTimeout(random);
        }
    }

    async fillFullName(name: string, rand: boolean) {
        if (rand) {
            await this.fillWithRandom(this.locatorFullName, name);
        }else {
        await this.page.locator(this.locatorFullName).fill(name);
        }   
    }

    async fillNumber(number: string, rand: boolean) {
        if(rand) {
            await this.fillWithRandom(this.locatorNumber, number);
        }
        await this.page.locator(this.locatorNumber).first().fill(number);
    }
}