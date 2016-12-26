import {BaseValueObject} from "../../base/value-object";

export type AutoResponderEntryTypeName = "File" | "Directory" | "Glob" | "RegExp";

export class AutoResponderEntryType extends BaseValueObject<AutoResponderEntryTypeName> {
}