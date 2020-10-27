/**
 * Class for handling a queue backed up by a store.
 *
 * @class Queue
 *
 * @param {string} name - The name of the queue.
 * @returns {Queue} - Returns the instance of the queue.
 */
export function Queue(name: string): Queue;
export class Queue {
    /**
     * Class for handling a queue backed up by a store.
     *
     * @class Queue
     *
     * @param {string} name - The name of the queue.
     * @returns {Queue} - Returns the instance of the queue.
     */
    constructor(name: string);
    /**
     * Queue data.
     *
     * @type {Array}
     */
    queue: any[];
    /**
     * The storage method to use. Determines best storage method.
     *
     * @type {object}
     */
    storage: object;
    all(): any[];
    first(): object;
    last(): object;
    add(item: object): Queue;
    replace(items: any[]): Queue;
    shift(): object;
    save(): Queue;
}
