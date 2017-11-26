export abstract class BaseValueObject<T> {
    protected _value: T;
    constructor(_value: T);
    readonly value: T;
}
