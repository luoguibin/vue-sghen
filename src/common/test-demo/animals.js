export class Animal {
    constructor(name) {
        this.name = name
    }

    toString() {
        return `Animal::{name:${this.name}}`
    }
}

export class Cat extends Animal {
    constructor(name) {
        super(name)
    }
}

export class Dog extends Animal {
    constructor(name) {
        super(name)
    }
}