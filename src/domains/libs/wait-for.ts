import {PromisedSetTimeout} from './promised-set-timeout';

export async function WaitFor<T>(command: () => Promise<T | null>, time: number, max: number): Promise<T | null> {
    while (max--) {
        let result = await command();
        if (result) return result;
        await PromisedSetTimeout(time);
    }
    return null;
}
