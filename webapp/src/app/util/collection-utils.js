/**
 * @param {!(Array<E>|HTMLCollection)} arr
 * @param {!function(item: E, idx: Number, Array<E> arr): boolean} predicate
 * @return {boolean} `true` if *every* item in the array matches the predicate, `false` otherwise
 * @template E
 * @see Array#every
 */
export function everyMatch(arr, predicate) {
    for (let i = 0; i < arr.length; i++) {
        if (!predicate(arr[i], i, arr)) {
            return false;
        }
    }
    return true;
}

/**
 * @param {!(Array<E>|HTMLCollection)} arr
 * @param {!function(item: E, idx: Number, Array<E> arr): boolean} predicate
 * @return {boolean} `true` if *any* item in the array matches the predicate, `false` otherwise
 * @template E
 * @see Array#some
 */
export function someMatch(arr, predicate) {
    for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i], i, arr)) {
            return true;
        }
    }
    return false;
}

/**
 * Unverified micro-optimisation: *Should* be faster than `Array.from(arr).indexOf(elem)`
 * @param {!HTMLCollection} arr
 * @param {Element} elem
 * @return {number}
 * @see Array#indexOf
 */
export function indexOf(arr, elem) {
    for (let i = 0; i < arr.length; i++) {
        if (arr.item(i) === elem) {
            return i;
        }
    }
    return -1;
}
