/**
 * Make the page tracking request.
 *
 * @param {object} config - Configuration object. If omitted, will use the defaults.
 * @param {Function=} callback - Callback function. Called when request completed.
 * @returns {void}
 */
export function page(config: object, callback?: Function | undefined): void;
export namespace page {
    export { init };
}
declare function init(): void;
export {};
