/**
 * @param {(string|null)} [str=null]
 * @return {(string|null)}
 */
export function firstCharToUpper(str) {
    if (str == null) {
        return str;
    }
    if (str.length === 0) {
        return str;
    }
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

/**
 * @param {Array<(string|null|undefined)>} strs
 * @param {string} separator
 * @return {string}
 */
export function join(strs, separator) {
    return strs
            .filter(it => it != null && it.length !== 0)
            .join(separator);
}
