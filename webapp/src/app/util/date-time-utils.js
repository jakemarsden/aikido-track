import DateTime from "luxon/src/datetime.js";

/**
 * @param {string} dateStr
 * @param {string} timeStr
 * @return {DateTime}
 */
export function fromIsoDateAndTime(dateStr, timeStr) {
    return DateTime.fromISO(`${dateStr}T${timeStr}`);
}
