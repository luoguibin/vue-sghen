import Person from './person'

export default class Teacher extends Person {

    grade = ''

    constructor(id, name) {
        super(id, name)
    }

    setGrade(grade) {
        this.grade = grade
    }

    toString() {
        return `Teacher::{id:${this.id}, name:${this.name}}`
    }
}