const StorageKey = 'app-storage';

export class StorageService {
    private readonly canPersist: boolean;
    private readonly storage: Storage;
    private state: { [key: string]: any };

    constructor(backingStorage: Storage) {
        this.storage = backingStorage;
        this.canPersist = isStorageSupported(backingStorage);

        this.reload();
    }

    set(key: string, value: any) {
        this.state[key] = value;
        this.save();
        return this;
    }

    get<T=any>(key: string, defaultValue?: T) {
        return this.has(key) ? this.state[key] as T : defaultValue;
    }

    unset<T=any>(key: string) {
        let oldValue: T | undefined;

        if (this.has(key)) {
            oldValue = this.state[key];
            delete this.state[key];
            this.save();
        }

        return oldValue;
    }

    clear() {
        this.state = {};
        this.save();
        return this;
    }

    has(key: string) {
        return this.state.hasOwnProperty(key);
    }

    save() {
        if (this.canPersist) {
            this.storage.setItem(StorageKey, JSON.stringify(this.state));
        }
    }

    reload() {
        let state: {} = {};

        if (this.canPersist) {
            const json = this.storage.getItem(StorageKey);
            const deserialized = json && JSON.parse(json);
            
            if (deserialized && typeof(deserialized) === 'object')
                state = deserialized;
        }

        this.state = state;
    }
}

function isStorageSupported(storage: Storage) {
    try {
        // This additional test is due to Private Mode in  Safari in 
        // iOS 10 *technically* having sessionStorage, but having a quota
        // of 0, making any `setItem` call fail.
        const testKey = '__storage_test';
        storage.setItem(testKey, testKey);
        storage.removeItem(testKey);
        return true;
    }
    catch(ex) {
        return false;
    }
}