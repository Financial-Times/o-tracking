declare namespace _default {
    export { setRootID };
    export { getRootID };
    export { track };
}
export default _default;
/**
 * Generate and store a new rootID, used to mark a new root event that
 * subsequent events will be linked to.
 *
 * @returns {string|*} The rootID.
 */
declare function setRootID(): string | any;
/**
 * Get the current rootID.
 *
 * @returns {string|*} The rootID.
 */
declare function getRootID(): string | any;
/**
 * Make a tracking request.
 *
 * @param {object} config - Should be passed an object containing a format and the values for that format
 * @param {Function} [callback] - Fired when the request has been made.
 *
 * @returns {object} request
 */
declare function track(config: object, callback?: Function): object;
