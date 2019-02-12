import { launch, Page, Request } from 'puppeteer'
export class Interactions {

    static async doActions(page: Page) {
        const mouse = page.mouse;
        // move 
        await mouse.move(0, 0);
        await mouse.move(0, 100);
    }
}