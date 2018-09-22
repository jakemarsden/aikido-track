/**
 * @param {number} start Inclusive
 * @param {number} end Exclusive
 * @param {number} [step=1]
 * @return {Array<number>}
 */
export function range(start, end, step) {
    if (step === undefined) {
        step = 1;
    }
    const arr = new Array(end - start);
    for (let i = start; i < end; i += step) {
        arr[i] = i;
    }
    return arr;
}
