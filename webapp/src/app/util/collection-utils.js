/**
 * Unverified micro-optimisation: *Should* be faster than `Array.from(arr).indexOf(elem)`
 * @param {!HTMLCollection} arr
 * @param {Element} elem
 * @return
 */
export function indexOf(arr, elem) {
    for (let i = 0; i < arr.length; i++) {
        if (arr.item(i) === elem) {
            return i;
        }
    }
    return -1;
}
