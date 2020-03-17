import Person from './person'

export default class Student extends Person {

    grade = ''

    constructor(id, name) {
        super(id, name)
    }

    setGrade(grade) {
        this.grade = grade
    }

    toString() {
        return `Student::{id:${this.id}, name:${this.name}}`
    }
}