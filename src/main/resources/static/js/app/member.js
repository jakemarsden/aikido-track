define([], () => {
    "use strict";

    /** @class Member */
    class Member {
        /**
         * @param {string} [id=]
         * @param {string} [firstName=]
         * @param {string} [lastName=]
         * @param {string} [type=]
         * @param {string} [birthDate=]
         */
        constructor(id, firstName, lastName, type, birthDate) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.type = type;
            this.birthDate = birthDate;
        }

        /**
         * @param {!object} obj
         * @return {!Member}
         * @static
         */
        static fromJson(obj) {
            const member = new Member();
            Object.assign(member, obj);
            return member;
        }
    }

    return Member;
});
