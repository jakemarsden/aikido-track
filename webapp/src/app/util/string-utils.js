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
