export type Session = {
    /**
     * - The id of the session
     */
    id: string;
    /**
     * - Whether it is a brand new session
     */
    isNew: boolean;
};
/**
 * Get the session from the store. Expiry and gen of a new session are handled here.
 *
 * @returns {Session} the current session
 */
declare function getSession(): Session;
/**
 * Init
 *
 * @param {string|object} [config] The name used to store the session or configuration object.
 * @returns {Session} - The session
 */
export function init(config?: string | object): Session;
export { getSession as session };
