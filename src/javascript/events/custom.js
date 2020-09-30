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
 * @returns {void}
 */
function event(trackingEvent, callback) {
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

const init = function init() {
	addEvent(window, 'oTracking.event', event);
};
event.init = init;

export { event };
