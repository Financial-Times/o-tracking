/**
 * Given the name of a transport, returns that transport if it exists.
 *
 * @param {string} name - The name of the transport to use
 * @returns {Function|undefined} - The transport function or undefined if not found.
 */
export function get(name: string): Function | undefined;
/**
 * @type {object|undefined} - mock transport for testing
 */
export const mock: object | undefined;
import { xhr } from "./xhr.js";
import { sendBeacon } from "./send-beacon.js";
import { image } from "./image.js";
export { xhr, sendBeacon, image };
