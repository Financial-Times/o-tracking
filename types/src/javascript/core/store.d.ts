/**
 * Class for storing data
 * Will choose the 'best' storage method available. Can also specify a type of storage.
 *
 * @class  Store
 */
export class Store {
    /**
     *
     * @param {string} name - The name of the store
     * @param {object} config - Optional, config object for extra configuration
     * @param {string} [config.nameOverride] - The internal name for the store
     * @param {string} [config.domain] - The domain that should be used to store cookies on
     */
    constructor(name: string, config?: {
        nameOverride: string;
        domain: string;
    });
    config: any;
    /**
     * Store data.
     */
    data: any;
    /**
     * The key/name of this store.
     */
    storageKey: any;
    /**
     * The storage method to use.
     *
     * @type {object}
     */
    storage: object;
    /**
     * Get/Read the current data.
     *
     * @returns {object} Returns the data from the store.
     */
    read(): object;
    /**
     * Write the supplied data to the store.
     *
     * @param {string} data - The data to write.
     * @returns {Store} - The instance of the store
     */
    write(data: string): Store;
    /**
     * Delete the current data.
     *
     * @returns {Store} - The instance of the store
     */
    destroy(): Store;
}
