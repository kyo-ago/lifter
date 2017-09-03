export abstract class BaseValueObject<T> {
    constructor(
        protected _value: T
    ) {
    }

    get value() {
        return this._value;
    }
}