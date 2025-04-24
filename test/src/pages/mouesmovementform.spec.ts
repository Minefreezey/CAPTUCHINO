import { Page } from "@playwright/test";

export class MouseMovementFormPage {
  baseUrl = "http://localhost:5173";

  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.baseUrl);
  }

  async moveto(
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number },
    steps: number,
    isStraight: boolean,
  ) {
    const startX = startPosition.x;
    const startY = startPosition.y;
    const endX = endPosition.x;
    const endY = endPosition.y;

    for (let i = 1; i <= steps; i++) {
      const intermediateX =
        startX +
        (endX - startX) * (i / steps) +
        (isStraight ? 0 : Math.random() * 10 - 5);
      const intermediateY =
        startY +
        (endY - startY) * (i / steps) +
        (isStraight ? 0 : Math.random() * 10 - 5);

      await this.page.mouse.move(intermediateX, intermediateY);
      await this.page.waitForTimeout(10);
    }

    await this.page.mouse.move(endX, endY);
  }

  async myClick() {
    await this.page.mouse.down();
    await this.page.waitForTimeout(10);
    await this.page.mouse.up();
    await this.page.waitForTimeout(50);
  }

  async scrollWindow() {
    await this.page.mouse.wheel(0, 200);
    await this.page.waitForTimeout(1000);
  }

  async fillWithRandom(value: string) {
    for (let i = 0; i < value.length; i++) {
      await this.page.keyboard.type(value[i]);
      const random = Math.floor(Math.random() * 200) + 100;

      await this.page.waitForTimeout(random);
    }
  }

  async fillWithFullName(name: string, type: boolean) {
    if (type) {
      await this.fillWithRandom(name);
    } else {
      await this.page.keyboard.insertText(name);
    }
  }

  async fillWithNumber(number: string, type: boolean) {
    if (type) {
      await this.fillWithRandom(number);
    } else {
      await this.page.keyboard.insertText(number);
    }
  }

  async fillWithOtp(otp: string, type: boolean) {
    if (type) {
      this.fillWithRandom(otp);
    } else {
      this.page.keyboard.insertText(otp);
    }
  }
}
