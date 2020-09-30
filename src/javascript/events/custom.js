import core from '../core.js';
import {
	is,
	broadcast,
	merge,
	addEvent} from '../utils.js';

/**
 * Default properties for events.
 *
 * @type {object}
 * @returns {object} - Default configuration for events
 */
const defaultEventConfig = function () {
	return {
		category: 'event',
		action: 'generic',
		context: {}
	};
};

/**
 * Track an event.
 *
 * @param {object} trackingEvent - The event, which could the following properties in its 'detail' key:
 * @param {object} [trackingEvent.detail] - Custom properties to add to the event.
 * @param {string} [trackingEvent.detail.category] - Category for this event e.g. page
 * @param {string} [trackingEvent.detail.action] - Action for this event e.g. view
 * @param {string} [trackingEvent.detail.component_id] - The ID for the component instance.
 * @param {object} [trackingEvent.detail.context] - Extra context to add to the event
 *
 * @param {Function} [callback] - Optional, Callback function. Called when request completed.
 * @returns {Promise<void>}
 */
async function event(trackingEvent, callback) {
	if (is(trackingEvent.detail.category) || is(trackingEvent.detail.action)) {
		const noCategoryActionVals = 'Missing category or action values';
		broadcast('oErrors', 'log', {
			error: noCategoryActionVals,
			info: { module: 'o-tracking' }
		});
		throw noCategoryActionVals;
	}

	const config = merge(defaultEventConfig(), {
		category: trackingEvent.detail.category,
		action: trackingEvent.detail.action,
		context: trackingEvent.detail
	});

	delete config.context.category;
	delete config.context.action;

	const origamiElement = getOrigamiEventTarget(trackingEvent);
	if (origamiElement) {
		config.context.component_name = origamiElement.getAttribute('data-o-component');
		if (!config.context.component_id) {
			broadcast('oErrors', 'log', {
				error: 'Missing an ID for the component being tracked. Need to add a `component_id` property to the event being tracked.',
				info: { module: 'o-tracking' }
			});
		}
	}

	core.track(config, callback);
}

/**
 * Helper function that gets the target of an event if it's an Origami component
 *
 * @param  {Event} event - The event triggered.
 * @returns {HTMLElement|undefined} - Returns the HTML element if an Origami component, else undefined.
 */
function getOrigamiEventTarget(event) {
	// IE backwards compatibility (get the actual target). If not IE, uses
	// `event.target`
	const element = event.target || event.srcElement;

	if (element && element.getAttribute('data-o-component')) {
		return element;
	}
}

/**
 * Converts a buffer into hex.
 *
 * @param {ArrayBuffer} buffer the buffer to convert to hex
 * @returns {string} hex representation of the buffer
 */
function buffer2hex(buffer) {
	let hex = '';
	for (const chunk of new Uint8Array(buffer)) {
		hex += ('00' + chunk.toString(16)).slice(-2);
	}
	return hex;
}

// function cyrb53 (str) {
// 	let h1 = 0xdeadbeef;
// 	let h2 = 0x41c6ce57;
//     for (let i = 0, ch; i < str.length; i++) {
//         ch = str.charCodeAt(i);
//         h1 = Math.imul(h1 ^ ch, 2654435761);
//         h2 = Math.imul(h2 ^ ch, 1597334677);
//     }
//     h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
//     h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
//     return 4294967296 * (2097151 & h2) + (h1>>>0);
// };

/**
 * Gets the xpath for an element
 *
 * @param  {HTMLElement} element - The element to get a path for.
 *
 * @private
 *
 * @returns {Array} The xpath
 */
function _getElementPath(element) {
	const path = [];

	while (element) {
		path.push(element);
		element = element.parentElement;
	}

	return path;
}

const init = function init() {
	addEvent(window, 'oTracking.event', event);
};
event.init = init;

export { event };
