export function PromisedSetTimeout(wait: number) {
    return new Promise((result) => setTimeout(result, (<any>PromisedSetTimeout).wait || wait));
}

export async function waitFor(command: Function, time: number, max: number) {
    for (let i = 5; i; i--) {
        let result = await command();
        if (result) return;
        await PromisedSetTimeout(100);
    }
    throw new Error('application.isContentRendering timeout');
}
