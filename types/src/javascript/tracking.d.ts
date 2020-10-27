export default tracking;
declare namespace tracking {
    export const initialised: boolean;
    export { version };
    export { updateConfig };
    export { source };
    export { destroy };
    export { toString };
    export { init };
    export { initClick as click };
    export { event };
    export { page };
    export { initView as view };
    export const getRootID: () => any;
}
/**
 * The version of the tracking module.
 *
 * @type {string}
 */
declare const version: string;
/**
 * Update the tracking configuration with any state changes. The supplied
 * config is merged with any existing config; to unset a value, set it as
 * null or undefined.
 *
 * @param {object} newConfig The configuration object to merge in - see init()
 * @returns {void}
 */
declare function updateConfig(newConfig: object): void;
/**
 * The source of this event.
 *
 * @type {string}
 */
declare const source: string;
/**
 * Clean up the tracking module.
 *
 * @returns {void}
 */
declare function destroy(): void;
/**
 * Overload toString method to show the version.
 *
 * @returns {string} The module's version.
 */
declare function toString(): string;
/**
 * Initialises the Tracking object.
 *
 * All options are optional, if a configuration option is missing, the module
 * will try to initialise using any configuration found in the DOM using the
 * script config tag.
 *
 * @example
 * <!-- DOM configuration settings -->
 * <script type='application/json' data-o-tracking-config>
 * page: {
 * 	 product: 'desktop'
 * },
 * user: {
 *   user_id: '023ur9jfokwenvcklwnfiwhfoi324'
 * }
 * </script>
 *
 * @param {object} config 					- See {@link Tracking} for the configuration options.
 * @param {boolean=} config.test             - Optional, if `true`, the data sent to Spoor will be marked as test data.
 * @param {string=} config.configId          - Optional
 * @param {string=} config.session           - Optional
 * @param {string=} config.cookieDomain      - Optional
 * @param {object=} config.context           - Optional
 * @param {object=} config.user              - Optional
 * @param {object=} config.system            - Optional
 * @param {object=} config.device            - Optional
 *
 * @returns {tracking|null} - The initialised tracking object or null if no configuration has been given.
 */
declare function init(config?: {
    test?: boolean | undefined;
    configId?: string | undefined;
    session?: string | undefined;
    cookieDomain?: string | undefined;
    context?: object | undefined;
    user?: object | undefined;
    system?: object | undefined;
    device?: object | undefined;
}): {
    /**
     * The initialised state of the object.
     *
     * @type {boolean}
     */
    initialised: boolean;
    version: string;
    updateConfig: typeof updateConfig;
    source: string;
    destroy: typeof destroy;
    toString: typeof toString;
    init: typeof init;
    click: (category: string, elementsToTrack: string) => void;
    event: typeof event;
    page: typeof page;
    view: (opts?: any) => undefined;
    getRootID: () => any;
} | null;
import { init as initClick } from "./events/click.js";
import { event } from "./events/custom.js";
import { page } from "./events/page-view.js";
import { init as initView } from "./events/component-view.js";
