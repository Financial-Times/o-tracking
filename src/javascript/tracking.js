import settings from './core/settings';
import user from './core/user';
import session from './core/session';
import send from './core/send';
import event from './events/custom';
import page from './events/page-view';
import click from './events/click';
import { getRootID } from './core';
import { merge, broadcast, log } from './utils';
import view from './events/component-view';


if (Array.isArray(window.oTrackingCommandQueue)) {
	for (const item of window.oTrackingCommandQueue) {
		switch (item.name) {
			case "init": {
				init.apply(undefined, item.arguments);
				break;
			}
			case "page": {
				page.apply(undefined, item.arguments);
				break;
			}
			case "click.init": {
				click.init.apply(click, item.arguments);
				break;
			}
			case "view.init": {
				view.init.apply(view, item.arguments);
				break;
			}
			case "event": {
				event.apply(undefined, item.arguments);
				break;
			}
			case "page.init": {
				page.init.apply(page, item.arguments);
				break;
			}
			case "event.init": {
				event.init.apply(event, item.arguments);
				break;
			}
			default: {
				log(`A command was queue which does not exist named: "${item.name}". Commands which exist are: "init", "page", "click.init", "view.init", "event", "page.init", and "event.init".`);
			}
		}
	}
	delete window.oTrackingCommandQueue;
}

if (window.pageTracker) {
	window.removeEventListener('oTracking.page', window.pageTracker);
}

if (window.eventTracker) {
	window.removeEventListener('oTracking.event', window.eventTracker);
}

if (Array.isArray(window.oTrackingEventQueue)) {
	for (const item of window.oTrackingEventQueue) {
		switch (item.name) {
			case "page": {
				page.apply(undefined, item.event.detail);
				break;
			}
			case "event": {
				event.apply(undefined, item.arguments);
				break;
			}
			default: {
				log(`An event was queued which does not exist named: "${item.name}". Events which exist are: "page", and "event".`);
			}
		}
	}
	delete window.oTrackingEventQueue;
}

/**
* The version of the tracking module.
* @type {string}

*/
const version = '2.0.10';

/**
* The source of this event.
* @type {string}

*/
const source = 'o-tracking';

/**
 * Update the tracking configuration with any state changes. The supplied
 * config is merged with any existing config; to unset a value, set it as
 * null or undefined.
 *
 * @param {Object} newConfig The configuration object to merge in - see init()
 * @return {void}
 */
function updateConfig(newConfig) {
	let config = settings.get('config') || {};

	config = merge(config, newConfig);
	settings.set('config', config);

	if (config.user && config.user.user_id) {
		user.setUser(config.user.user_id);
	}
}

/**
 * Clean up the tracking module.
 * @return {void}
 */
function destroy() {
	tracking.initialised = false;

	settings.destroy('config');
	settings.destroy('page_sent');
}
/**
 * Overload toString method to show the version.
 * @return {string} The module's version.
 */
function toString() {
	return 'oTracking version ' + version;
}

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
 * @param {Object} config 					- See {@link Tracking} for the configuration options.
 * @param {boolean=} config.test             - Optional, if `true`, the data sent to Spoor will be marked as test data.
 * @param {string=} config.configId          - Optional
 * @param {string=} config.session           - Optional
 * @param {string=} config.cookieDomain      - Optional
 * @param {object=} config.context           - Optional
 * @param {object=} config.user              - Optional
 * @param {object=} config.system            - Optional
 * @param {object=} config.device            - Optional
 *
 * @return {tracking|null} - The initialised tracking object or null if no configuration has been given.
 */
function init(config = {}) {
	if (tracking.initialised) {
		return tracking;
	}

	const hasDeclarativeConfig = Boolean(
		getDeclarativeConfigElement()
	);

	if (hasDeclarativeConfig) {
		config = getDeclarativeConfig(config);
	}

	// If there's no config, there is no point initialising!
	// http://stackoverflow.com/a/32108184
	if (Object.keys(config).length === 0 && config.constructor === Object) {
		return null;
	}

	settings.set('version', version);
	settings.set('source', source);

	settings.set('page_sent', false);

	const cookieDomain = config ? config.cookieDomain : '';

	// Set up the user from stored - may later be updated by config
	user.init('', cookieDomain);
	updateConfig(config);

	// Session
	session.init(config.session);

	// Initialize the sending queue.
	send.init();

	event.init();
	page.init();
	tracking.initialised = true;
	return tracking;
}

/**
 * Retrieves the <script type='application/json' data-o-tracking-config> element that is in the DOM, otherwise returns null.
 * @private
 * @return {HTMLElement|null} - Returns the <script> element if found otherwise returns null.
 */
function getDeclarativeConfigElement() {
	return document.querySelector('script[data-o-tracking-config]');
}

/**
 * Initialises additional data using the <script type='application/json' data-o-tracking-config> element in the DOM.
 * @private
 * @param {Object} options - A partially, or fully filled options object.  If
 *                           an option is missing, this method will attempt to
 *                           initialise it from the DOM.
 * @return {Object|false} - The options modified to include the options gathered from the DOM
 */
function getDeclarativeConfig(options) {
	const configEl = getDeclarativeConfigElement();
	let declarativeConfigString;
	if (configEl) {
		declarativeConfigString = configEl.textContent || configEl.innerText || configEl.innerHTML;
	} else {
		return false;
	}

	try {
		const declarativeOptions = JSON.parse(declarativeConfigString);
		Object.assign(options, declarativeOptions);
	} catch(e) {
		const configError = new Error('Invalid JSON configuration syntax, check validity for o-tracking configuration: "' + e.message + '"');
		broadcast('oErrors', 'log', {
			error: configError.message,
			info: { module: 'o-tracking' }
		});
		throw configError;
	}

	return options;
}

const tracking = {
	/**
	* The initialised state of the object.
	* @type {boolean}
	*/
	initialised: false,
	version,
	updateConfig,
	source,
	destroy,
	toString,
	init,
	click,
	event,
	page,
	view,
	getRootID
};

export default tracking;
