export function PromisedSetTimeout(wait: number) {
    return new Promise(result => setTimeout(result, (<any>PromisedSetTimeout).wait || wait));
}
