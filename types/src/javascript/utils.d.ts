/**
 * Log messages to the browser console. Requires 'log' to be set on init.
 *
<<<<<<< Updated upstream
 * @param {*} args items to log
 * @returns {void}
 */
export function log(...args: any): void;
/**
 * Tests if variable is a certain type. Defaults to check for undefined if no type specified.
 *
 * @param {*} variable - The variable to check.
 * @param {string=} type - The type to test for. Defaults to undefined.
 *
 * @returns {boolean} - The answer for if the variable is of type.
 */
export function is(variable: any, type?: string | undefined): boolean;
/**
 * Merge objects together. Will remove undefined and null values.
 *
 * @param {object} target - The original object to merge in to.
 * @param {object} options - The object to merge into the target. If omitted, will merge target into a new empty Object.
 *
 * @returns {object} The merged object.
 */
export function merge(target: object, options: object): object;
/**
 * URL encode a string.
 *
 * @param {string} str - The string to be encoded.
 * @returns {string} The encoded string.
 */
export function encode(str: string): string;
/**
 * URL decode a string.
 *
 * @param {string} str - The string to be decoded.
 * @returns {string} The decoded string.
 */
export function decode(str: string): string;
import { api as cuid } from "../libs/browser-cuid.js";
/**
 * Utility to add event listeners.
 *
 * @param {Element} element
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} listener
 * @returns {void}
 */
export function addEvent(element: Element, event: string, listener: EventListenerOrEventListenerObject): void;
/**
 * Utility for dispatching custom events from window
 *
 * @param {string} namespace
 * @param {string} eventType
 * @param {object} detail
 * @returns {void}
 */
export function broadcast(namespace: string, eventType: string, detail: object): void;
/**
 * Listen for page tracking requests.
 *
 * @param {Function} cb - The callback to be called whenever a page is tracked.
<<<<<<< Updated upstream
 * @returns {void}
=======
 * @return {void}
>>>>>>> Stashed changes
 */
export function onPage(cb: Function): void;
/**
 * Trigger the 'page' listeners.
<<<<<<< Updated upstream
 *
 * @returns {void}
=======
 * @return {void}
>>>>>>> Stashed changes
 */
export function triggerPage(): void;
/**
 * Get a value from document.cookie matching the first match of the regexp you supply
 *
 * @param {RegExp} matcher - The Regex to match with
 * @returns {string} - The vale from the cookie
 */
export function getValueFromCookie(matcher: RegExp): string;
/**
 * Trim strings
 *
 * @param {string} str - The string to trim.
 * @returns {string} The trimmed string.
 */
export function sanitise(str: string): string;
/**
 * Assign the subject value if the target properties are undefined
 *
 * @param {object} subject - assign the value
 * @param {object} target - be assigned the value
 * @returns {void}
 */
export function assignIfUndefined(subject: object, target: object): void;
/**
 * Get a value from a specified JavaScript variable.
 * @param {String} str - The name of variable, in dot syntax.
 * @return {String|null} The value from the JS variable.
>>>>>>> Stashed changes
 */
export function filterProperties(objectToFilter: any, allowedPropertyNames: any): string | null;
/**
 * Used to find out all the paths which contain a circular reference.
 *
 * @param {*} rootObject The object we want to search within for circular references
 * @returns {string[]} Returns an array of strings, the strings are the full paths to the circular references within the rootObject
 */
export function findCircularPathsIn(rootObject: any): string[];
/**
 * Used to find out whether an object contains a circular reference.
 *
 * @param {object} rootObject The object we want to search within for circular references
 * @returns {boolean} Returns true if a circular reference was found, otherwise returns false
 */
export function containsCircularPaths(rootObject: object): boolean;
/**
 * Find out whether two objects are deeply equal to each other.
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean} - true if the two arguments are deeply equal
 */
export function isDeepEqual(a: any, b: any): boolean;
export { is as isUndefined, cuid as guid };
