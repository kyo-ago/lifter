import * as App from "./application/application";
import { getContainer } from "./inversify.config";

export type Application = App.Application;

export async function createApplication(
    projectBaseDir: string,
    userDataPath: string,
    userHomePath: string,
): Promise<App.Application> {
    let container = await getContainer(
        projectBaseDir,
        userDataPath,
        userHomePath,
    );
    return container.get(App.Application);
}
