/** @class Member */
class Member {
    /**
     * @param {?string} id
     * @param {?string} firstName
     * @param {?string} lastName
     * @param {?string} type
     * @param {?string} birthDate
     */
    constructor(id, firstName, lastName, type, birthDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.type = type;
        this.birthDate = birthDate;
    }

    /** @return {string} */
    toString() {
        return "Member[id=" + this.id + ", firstName=" + this.firstName + ", lastName=" + this.lastName +
                ", type=" + this.type + ", birthDate=" + this.birthDate + "]";
    }

    /** @return {string} */
    toJson() {
        return JSON.stringify(this);
    }

    /**
     * @param {object} obj
     * @return {Member}
     * @static
     */
    static fromJson(obj) {
        const member = new Member();
        Object.assign(member, obj);
        return member;
    }
}

export default Member;
