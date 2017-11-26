export interface IOResult {
    stdout: string;
    stderr: string;
}
export declare function throwableCommand(promisedCommand: Promise<IOResult>): Promise<string>;
