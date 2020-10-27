/**
 * Saves a value. Stores a copy rather than a reference, to avoid mutations leaking.
 *
 * @param {string} key - The key to use to store the object
 * @param {*} value - The value
 * @returns {void}
 */
export function set(key: string, value: any): void;
/**
 * Retrieves a value from the settings object. Returns a copy rather than reference, to
 * avoid mutations leaking.
 *
 * @param {string} key - The key to get
 * @returns {*} - The setting.
 */
export function get(key: string): any;
/**
 * Deletes a value
 *
 * @param  {string} key - The key to delete
 * @returns {void}
 */
export function destroy(key: string): void;
