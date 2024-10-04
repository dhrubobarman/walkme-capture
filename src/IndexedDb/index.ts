const DB_NAME = 'indexed-db';

type useIndexedDbProps = {
  /**
   * The name of the IndexedDB database.
   * @default "indexed-db"
   */
  dbName?: string;
  /**
   * The name of the object store within the database.
   */
  storeName: string;
  /**
   * The unique key for the object store.
   */
  uniqueKey: string;
  /**
   * Enable or disable debug mode.
   */
  debug?: boolean;
  /**
   * The version of the IndexedDB database.
   * @default 1
   */
  version?: number;
};

/**
 * Custom hook for interacting with IndexedDB.
 * @param dbName - The name of the database.
 * @param storeName - The name of the object store.
 * @param uniqueKey - The unique key for the object store.
 * @param debug - Flag to enable debug mode.
 * @param version - The version of the database.
 * @returns An object containing methods to interact with the IndexedDB store.
 */
export class IndexedDb<T> {
  /** Indicates if the database is ready. */
  isDBReady: boolean = false;

  private version: number;
  private dbName: string;
  private storeName: string;
  private key: string;
  private debug: boolean;
  constructor({ dbName = DB_NAME, storeName, uniqueKey, debug = false, version = 1 }: useIndexedDbProps) {
    this.version = version;
    this.isDBReady = false;
    this.dbName = dbName;
    this.storeName = storeName;
    this.key = uniqueKey;
    this.debug = debug;
    this.init();
  }

  async init() {
    await this.handleInitDB();
  }

  async handleInitDB() {
    const initDb = async () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains(this.storeName)) {
            if (this.debug) console.log('Creating users store');
            db.createObjectStore(this.storeName, { keyPath: this.key });
          }
        };

        request.onsuccess = () => {
          const db = request.result;
          this.version = db.version;
          resolve(db);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    };
    const status = await initDb();
    this.isDBReady = !!status;
  }

  /**
   * Adds data to the IndexedDB store.
   * @param data - The data to add.
   * @returns A promise that resolves to the added data, a string, or null.
   */
  addData(data: T): Promise<T | string | null> {
    const handleAddData = async (): Promise<T | string | null> => {
      return new Promise((resolve) => {
        const request = indexedDB.open(this.dbName, this.version);
        request.onsuccess = () => {
          if (this.debug) console.log('request.onsuccess - addData', data);
          const db = request.result;
          const tx = db.transaction(this.storeName, 'readwrite');
          const store = tx.objectStore(this.storeName);
          store.add(data);
          resolve(data);
        };

        request.onerror = () => {
          const error = request.error?.message;
          if (error) {
            resolve(error);
          } else {
            resolve('Unknown error');
          }
        };
      });
    };
    return handleAddData();
  }

  /**
   * Deletes data from the IndexedDB store.
   * @param key - The key of the data to delete.
   * @returns A promise that resolves to a boolean indicating success.
   */
  deleteData(key: string | number): Promise<boolean> {
    const handleDeleteData = async (): Promise<boolean> => {
      return new Promise((resolve) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onsuccess = () => {
          if (this.debug) console.log('request.onsuccess - deleteData', key);
          const db = request.result;
          const tx = db.transaction(this.storeName, 'readwrite');
          const store = tx.objectStore(this.storeName);
          const res = store.delete(key);
          res.onsuccess = () => {
            resolve(true);
          };
          res.onerror = () => {
            resolve(false);
          };
        };
      });
    };
    return handleDeleteData();
  }

  /**
   * Updates data in the IndexedDB store.
   * @param key - The key of the data to update.
   * @param data - The new data.
   * @returns A promise that resolves to the updated data, a string, or null.
   */
  updateData(key: string | number, data: T): Promise<T | string | null> {
    const handleUpdateData = async (): Promise<T | string | null> => {
      return new Promise((resolve) => {
        const request = indexedDB.open(this.dbName, this.version);
        request.onsuccess = () => {
          if (this.debug) console.log('request.onsuccess - updateData', key);
          const db = request.result;
          const tx = db.transaction(this.storeName, 'readwrite');
          const store = tx.objectStore(this.storeName);
          const res = store.get(key);
          res.onsuccess = () => {
            const newData = { ...res.result, ...data };
            store.put(newData);
            resolve(newData);
          };
          res.onerror = () => {
            resolve(null);
          };
        };
      });
    };
    return handleUpdateData();
  }

  getSingleItem(key: string): Promise<T | null> {
    const handleGetSingleData = async (): Promise<T | null> => {
      return new Promise((resolve) => {
        const request = indexedDB.open(this.dbName, this.version);
        request.onsuccess = () => {
          if (this.debug) console.log('request.onsuccess - getSingleData');
          const db = request.result;
          if (!db) return null;
          const tx = db.transaction(this.storeName, 'readonly');
          const store = tx.objectStore(this.storeName);
          const res = store.get(key);
          res.onsuccess = () => {
            resolve(res.result);
          };
        };
      });
    };
    return handleGetSingleData();
  }

  /**
   * Retrieves all data from the IndexedDB store.
   * @returns A promise that resolves to an array of data.
   */
  getStoreData(): Promise<T[]> {
    const handleGetStoreData = <T>(): Promise<T[]> => {
      return new Promise((resolve) => {
        const request = indexedDB.open(this.dbName, this.version);
        request.onsuccess = () => {
          if (this.debug) console.log('request.onsuccess - getAllData');
          const db = request.result;
          const tx = db.transaction(this.storeName, 'readonly');
          const store = tx.objectStore(this.storeName);
          const res = store.getAll();
          res.onsuccess = () => {
            resolve(res.result);
          };
        };
      });
    };

    return handleGetStoreData();
  }
}
