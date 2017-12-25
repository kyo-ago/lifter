/// <reference path="../node_modules/@kyo-ago/lifter-common/typings/global.d.ts" />

interface Dispath {
    (
        action: {
            type: string;
        }
    ): void;
}
