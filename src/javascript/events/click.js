/*global module, require */
'use strict';  // eslint-disable-line strict

const Delegate = require('ftdomdelegate');
const Queue = require('../core/queue');
const Core = require('../core');
const utils = require('../utils');

// Note: `context` is the term o-tracking uses for the data that is sent to spoor
let context = {};

// Trigger the event tracking
const track = _ => {
	if (!context.domPath || !context.domPath.length > 0) return false;

	var href = context.domPath[0].href || '';
	var isInternal = href.indexOf(window.document.location.hostname) > -1;

	if (isInternal) {
		console.log('Queue the event and send it on the next page load',context);
		internalQueue.add(context).save();
	}
	else {
		console.log('Send now, before leaving this page',context);
		Core.track({
			async: false,
			context: context
		});
	}
}

// Utility for trimming strings
const sanitise = property => {
	return (typeof property === 'string') ? property.trim().toLowerCase() : property;
}

// For a given container element, get the number of elements that match the
// clicked element (siblings); and the index of the clicked element (position).
const getSiblingsAndPosition = (el, clickedEl, dataTrackable) => {
	const siblings = Array.from(el.querySelectorAll(`[data-trackable="${dataTrackable}"]`));
	const position = siblings.findIndex(item => item === clickedEl);
	if(position === -1) return;
	return {
		siblings: siblings.length,
		position,
	};
}

// Get some properties of a given element.
// Todo: Consider capturing all properties that begin with "data-o-",
// in case it's useful to see how origami components are being utilised
const getElementProperties = el => {
	const elementPropertiesToCollect = [
		"nodeName",
		"className",
		"id",
		"href",
		"text",
		"role",
		"aria-controls",
		"aria-expanded",
		"data-trackable",
		"data-trackable-terminate",
		"data-o-component",
	];
	let elementProperties = elementPropertiesToCollect.reduce((returnObject, property) => {
		if (el[property]) {
			returnObject[property] = sanitise(el[property]);
		}
		else if (el.getAttribute(property)) {
			returnObject[property] = sanitise(el.getAttribute(property));
		}
		else if (el.hasAttribute(property)) {
			returnObject[property] = el.hasAttribute(property);
		}
		return returnObject;
	},{});
	return elementProperties;
};

// Trace the clicked element and all of its parents, collecting properties as we go
const getTrace = el => {
	const rootEl = document;
	const clickedEl = el;
	let trace = [];
	while (el && el !== rootEl) {
		let elementProperties = getElementProperties(el);

		// If the element happens to have a data-trackable attribute, get the siblings
		// and position of the clicked element (relative to the current element).
		if (elementProperties["data-trackable"]) {
			elementProperties = Object.assign (
				elementProperties,
				getSiblingsAndPosition(el, clickedEl, elementProperties["data-trackable"])
			);
		}
		trace.push(elementProperties);
		el = el.parentNode;
	}
	return trace;
};

// Get properties for the event (as opposed to properties of the clicked element)
// Available properties include mouse x- and y co-ordinates, for example.
const getEventProperties = event => {
	const eventPropertiesToCollect = [
		"ctrlKey",
		"altKey",
		"shiftKey",
		"metaKey",
		"timeStamp",
	]
	let eventProperties = eventPropertiesToCollect.reduce((returnObject, property) => {
		try {
			if (event[property]) returnObject[property] = sanitise(event[property]);
		}
		catch (e) {
			console.log(e);
		}
		return returnObject;
	},{});
	return eventProperties;
}

// Controller for handling click events
const handleClickEvent = clickEvent => {
	context = Object.assign (context, getEventProperties(clickEvent));
	context.domPath = getTrace(clickEvent.target);
	track();
}

/**
 * If there are any requests queued, attempts to send the next one
 * Otherwise, does nothing
 * @return {undefined}
 */
const runQueue = _ => {
	const next = _ => { runQueue(); callback(); };
	const nextLink = internalQueue.shift();
	if (nextLink) {
		Core.track(nextLink, next);
	}
}

const init = (category, elementsToTrack) => {
	context.action = 'click';
	context.category = category || 'o-tracking';
	elementsToTrack = elementsToTrack || 'a, button, input'; // See https://github.com/ftlabs/ftdomdelegate#selector-string

	// Activte the click event listener
	let delegate = new Delegate(document.body);
	delegate.on('click', elementsToTrack, handleClickEvent, true);

	// Track any queued events
	internalQueue = new Queue('clicks');
	runQueue();

	// Listen for page requests. If this is a single page app, we can send link requests now.
	utils.onPage(runQueue);


	// Development debug info
	// console.log(`Now tracking click events. Category: ${category}`);
	// console.log(`Elements to track: ${elementsToTrack}`);
	// console.log(`Attributes to collect: ${theAttributesToCollect}`);
}

module.exports = {
	init: init
};