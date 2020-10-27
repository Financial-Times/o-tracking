/**
 * Init a queue and send any leftover events.
 *
 * @returns {Queue} An initialised queue.
 */
export function init(): Queue;
/**
 * Adds a new request to the list of pending requests
 *
 * @param {object} request The request to queue
 * @returns {void}
 */
export function add(request: object): void;
/**
 * If there are any requests queued, attempts to send the next one
 * Otherwise, does nothing
 *
 * @param {Function} [callback] - Optional callback
 * @returns {void}
 */
export function run(callback?: Function): void;
/**
 * Convenience function to add and run a request all in one go.
 *
 * @param {object} request The request to queue and run.
 * @returns {void}
 */
export function addAndRun(request: object): void;
import { Queue } from "./queue.js";
