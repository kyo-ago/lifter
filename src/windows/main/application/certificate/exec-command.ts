import * as execa from "execa";
import {SECURITY_COMMAND} from "../../../../settings";
import {throwableCommand} from "../../../../libs/throwable-command";

export class ExecCommand {
    static findCertificate(certificateName: string) {
        return throwableCommand(execa(SECURITY_COMMAND, ['find-certificate', '-c', certificateName]));
    }

    static deleteCertificate(certificateName: string) {
        return throwableCommand(execa(SECURITY_COMMAND, ['delete-certificate', '-c', certificateName]));
    }

    static addTrustedCert(certificatePath: string): Promise<string> {
        return throwableCommand(execa(SECURITY_COMMAND, ['add-trusted-cert', certificatePath]));
    }
}
