/*global require, describe, it, before, after, sinon */

const assert = require("assert");
const settings = require("../src/javascript/core/settings");
const Queue = require("../src/javascript/core/queue");

describe('main', function () {

	let server;
	const oTracking = require("../main.js");
	let root_id;

	before(function () {
		new Queue('requests').replace([]);  // Empty the queue as PhantomJS doesn't always start fresh.
		settings.destroy('config');  // Empty settings.
		server = sinon.fakeServer.create(); // Catch AJAX requests
	});

	after(function () {
		server.restore();
	});

	it('should configure itself from the DOM if no options are present', function() {
		const confEl = document.createElement('script');
		confEl.type = 'application/json';
		confEl.dataset.oTrackingConfig = 'true';
		const config = {
			context: {
				product: 'desktop'
			},
			user: {
				user_id: '023ur9jfokwenvcklwnfiwhfoi324'
			}
		};
		confEl.innerText = JSON.stringify(config);

		document.head.appendChild(confEl);
		const tracking = oTracking.init();

		assert.deepEqual(settings.get('config'), config);
		assert.equal(tracking.initialised, true);

		document.head.removeChild(confEl);
		oTracking.destroy();
	});

	it('should track a page', function () {
		oTracking.init({
			context: {
				product: 'desktop'
			},
			user: {
				user_id: '023ur9jfokwenvcklwnfiwhfoi324'
			}
		});

		//console.log('cookies', document.cookie);

		server.respondWith([200, { "Content-Type": "plain/text", "Content-Length": 2 }, "OK"]);

		const callback = sinon.spy();
		let sent_data;

		oTracking.page({
			url: 'http://www.ft.com/cms/s/0/576f5f1c-0509-11e5-9627-00144feabdc0.html'
		}, callback);

		server.respond();
		assert.ok(callback.called, 'Callback not called.');

		sent_data = callback.getCall(0).thisValue;

		root_id = sent_data.context.root_id;

		// Basics
		assert.deepEqual(Object.keys(sent_data), ["system","context","user","device","category","action"]);

		// Meta
		assert.equal(sent_data.system.api_key, "qUb9maKfKbtpRsdp0p2J7uWxRPGJEP");
		assert.ok(sent_data.system.version.match(/\d+\.\d+.\d+/));
		assert.equal(sent_data.system.source, "o-tracking");

		// Type
		assert.equal(sent_data.category, "page");
		assert.equal(sent_data.action, "view");

		// User
		assert.equal(sent_data.user.user_id, '023ur9jfokwenvcklwnfiwhfoi324');

		// Page
		assert.equal(sent_data.context.url, "http://www.ft.com/cms/s/0/576f5f1c-0509-11e5-9627-00144feabdc0.html");
		assert.equal(sent_data.context.product, "desktop");
	});

	it('should track an event', function () {
		server.respondWith([200, { "Content-Type": "plain/text", "Content-Length": 2 }, "OK"]);

		const callback = sinon.spy();
		let sent_data;

		oTracking.event(new CustomEvent('oTracking.event', {
			detail: {
				category: 'video',
				action: 'play',
				component_id: '123456'
			}
		}), callback);

		server.respond();
		assert.ok(callback.called, 'Callback not called.');

		sent_data = callback.getCall(0).thisValue;

		// Basics
		assert.deepEqual(Object.keys(sent_data), ["system","context","user","device","category","action"]);

		// Type
		assert.equal(sent_data.category, "video");
		assert.equal(sent_data.action, "play");
		assert.equal(sent_data.context.component_id, "123456");

		// User
		assert.equal(sent_data.user.user_id, '023ur9jfokwenvcklwnfiwhfoi324');

		// Page
		assert.equal(sent_data.context.root_id, root_id);
		assert.equal(sent_data.context.product, "desktop");
	});

	it('should not mutate init config', function () {
		server.respondWith([200, { "Content-Type": "plain/text", "Content-Length": 2 }, "OK"]);

		const callback1 = sinon.spy();
		const callback2 = sinon.spy();
		let sent_data1;
		let sent_data2;

		oTracking.page({
			my_key: "my_val"
		}, callback1);

		server.respond();
		assert.ok(callback1.called, 'Callback not called.');

		sent_data1 = callback1.getCall(0).thisValue;
		assert.equal(sent_data1.context.my_key, "my_val");

		// Track another page
		oTracking.page({}, callback2);

		server.respond();
		assert.ok(callback2.called, 'Callback not called.');

		// Ensure vars from the first track don't leak into the second
		sent_data2 = callback2.getCall(0).thisValue;
		assert.equal(sent_data2.context.my_key, undefined);
	});

	it('should allow system properties to be set on init', function () {
		oTracking.destroy();

		oTracking.init({
			system: {
				environment: 'prod',
				is_live: true
			}
		});

		server.respondWith([200, { "Content-Type": "plain/text", "Content-Length": 2 }, "OK"]);

		const callback = sinon.spy();
		let sent_data;

		oTracking.page({}, callback);

		server.respond();
		assert.ok(callback.called, 'Callback not called.');

		sent_data = callback.getCall(0).thisValue;

		assert.equal(sent_data.system.environment, "prod");
		assert.equal(sent_data.system.is_live, true);
	});
});
