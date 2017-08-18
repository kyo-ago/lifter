interface IOResult {
    stdout: string;
    stderr: string;
}

export async function throwableCommand(promisedCommand: Promise<IOResult>): Promise<string> {
    let {stdout, stderr} = await promisedCommand;
    if (stderr) {
        throw new Error(stderr);
    }
    return stdout;
}
