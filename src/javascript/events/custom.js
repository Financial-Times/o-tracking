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
		config.context.component_id = config.context.component_id || await getComponentId(origamiElement);
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
 * Helper function that generates a component id based on its xpath
 *
 * @param {HTMLElement} element - The HTML Element to gen an ID for.
 *
 * @returns {Promise<string>} hash
 */
async function getComponentId(element) {
	const path = _getElementPath(element);

	if (typeof path === 'undefined') {
		return;
	}

	// Select the source element (first item in the ordered sequence `path`)
	const srcElement = path[0];

	// Because, you could have two identical elements in the DOM as siblings,
	// we need to determine the 'sibling index': the order they're sitting within a DOM node.
	// Although in reality this is unlikely to always be the same, it's just a
	// best guess - unless child elements are always appended to an element rather than added as the first child.
	const siblingIndex = (function getSiblingIndex(element) {
		const srcParent = element.parentElement;
		if (srcParent) {
			for (let i = 0; i < srcParent.childNodes.length; i++) {
				if (srcParent.childNodes[i] === srcElement) {
					return i;
				}
			}
			return -1;
		} else {
			return 0;
		}
	}(srcElement));

	// Generate a normalised string (normalising browser quirks) from the sequence of elements
	const normalisedStringPath = path.reduceRight(function(builder, el) {
		if (!el.nodeName) {
			return builder + ' - ' + el.constructor.name + '\n';
		}

		const nodeName = el.nodeName.toLowerCase();

		// In some browsers, document is prepended with a '#'
		if (nodeName.indexOf('#') === 0) {
			return builder + '<' + nodeName + '>';
		}

		// Replace this stuff with stuff that makes each node unique - without including styling detail (as this may change depending on animation state etc, position)
		return builder + '<' + nodeName +' id="' + (el.id || '') + '">';
	}, '');


	// Append a sibling index to the string and use some simple, off the shelf string hashing algorithm.
	const buffer = new TextEncoder().encode(normalisedStringPath + '_siblingIndex=' + siblingIndex);
	const digest = await crypto.subtle.digest('SHA-256', buffer);
	return buffer2hex(digest);
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
