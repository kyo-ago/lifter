import { Container } from "inversify";
import { getContainer } from "../../src/inversify.config";
import { TEST_REPOSITORY_BASE_DIR_PATH, TEST_USER_DATA_PATH } from "../settings";

export function getTestContainer(): Promise<Container> {
    return getContainer(TEST_REPOSITORY_BASE_DIR_PATH, TEST_USER_DATA_PATH);
}
