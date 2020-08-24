import {xhr} from './xhr';
import {sendBeacon} from './send-beacon';
import {image} from './image';

export {
	xhr,
	sendBeacon,
	image
};

/**
 * @type {object|undefined} - mock transport for testing
 */
export let mock = {};

export function get(name) {
	if (mock.transport) {
		return mock.transport;
	}
	switch (name) {
		case 'xhr': {
			return xhr;
		}
		case 'sendBeacon': {
			return sendBeacon;
		}
		case 'image': {
			return image;
		}
		default: {
			return undefined;
		}
	}
}
