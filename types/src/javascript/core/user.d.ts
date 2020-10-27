/**
 * Init
 *
 * @param {string} value The value of a userID to use if one is not stored
 * @param {string} cookieDomain The domain that should be used to cookie te user
 * @returns {string} - The user ID if present, or a generated UID if not
 */
export function init(value: string, cookieDomain: string): string;
/**
 * setUser
 *
 * @param {string} id The userID to set.
 * @returns {string} - The user ID if present, or a generated UID if not
 */
export function setUser(id: string): string;
/**
 * Get the user ID
 *
 * @returns {string} - The user ID
 */
declare function id(): string;
/**
 * Delete the current user data.
 *
 * @returns {void}
 */
export function destroy(): void;
export { id as userID };
