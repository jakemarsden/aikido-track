import {cssClasses as cssClasses_, numbers as numbers_, strings as strings_} from '../data-table/constants.js';

export const cssClasses = cssClasses_;

export const numbers = numbers_;

export const strings = {
    ...strings_,
    MEMBER_FIRST_NAME_SELECTOR: '.aik-member-data-table__first-name',
    MEMBER_LAST_NAME_SELECTOR: '.aik-member-data-table__last-name',
    MEMBER_TYPE_SELECTOR: '.aik-member-data-table__type',
    MEMBER_BIRTH_DATE_SELECTOR: '.aik-member-data-table__birth-date'
};
