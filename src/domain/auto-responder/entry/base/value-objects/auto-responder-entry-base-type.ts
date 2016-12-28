import {BaseValueObject} from "../../../../base/value-object";

export type AutoResponderEntryBaseTypeName = "File" | "Directory" | "Glob" | "RegExp";

export class AutoResponderEntryBaseType extends BaseValueObject<AutoResponderEntryBaseTypeName> {
}