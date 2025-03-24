export const useRecords = (...names) => {
    let records = { getHooks: creatHooks };
    for(let key of names) {
        const _key = key;
        Object.defineProperty(records, _key, {
            get() {
                return Records[_key];
            },
            set(value) {
                Records[_key] = value;
                for (let listener of Listeners[_key]) {
                    listener();
                }
            }
        })
    }
    return records;
}

const creatHooks = key => {
    const _key = key;
    return [
        createSubscribeFunc(_key),
        createGetSnapshotFunc(_key)
    ]
}

const createSubscribeFunc = key => {
    Listeners[key] = [];
    return listener => {
        Listeners[key] = [...Listeners[key], listener];
        return () => {
            Listeners[key] = Listeners[key].filter(l => l !== listener);
        };
    }
}

const createGetSnapshotFunc = key => {
    return () => Records[key];
}

const Listeners = (() => {
    const map = new Map();

    return {
        get: key => map.has(key) ? map.get(key) : [],
        set: (key, value) => { map.set(key, value); }
    }
})();

const Records = (() => {
    const map = new Map();

    return {
        get: key => map.get(key),
        set: (key, value) => { map.set(key, value); }
    }
})();
