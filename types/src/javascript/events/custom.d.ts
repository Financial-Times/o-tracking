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
export function event(trackingEvent: {
    detail: {
        category: string;
        action: string;
        component_id: string;
        context: object;
    };
}, callback?: Function): void;
export namespace event {
    export { init };
}
declare function init(): void;
export {};
