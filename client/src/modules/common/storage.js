export const useRecords = (...names) => {
    const hookStr = `getHooks: hooks,`
    let records = [];
    for(let key of names) {
        records.push(`
            get ['${key}']() {
                return records.get('${key}')
            },
            set ['${key}'](value) {
                records.set('${key}', value)
                for (let listener of listeners.get('${key}')) {
                    listener();
                }
            }
        `)
    }
    const funcBody = 'return {' + hookStr + records.join(',') + '}'
    return (
        new Function('records', 'listeners', 'hooks', funcBody)
    )(Records, Listeners, creatHooks);
}

const creatHooks = key => {
    return [
        createSubscribeFunc(key),
        createGetSnapshotFunc(key)
    ]
}

const createSubscribeFunc = key => {
    Listeners.set(key, []);
    const _key = key;
    return listener => {
        Listeners.set(_key, [...Listeners.get(_key), listener]);
        return () => {
            Listeners.set(_key, Listeners.get(_key).filter(l => l !== listener));
        };
    }
}

const createGetSnapshotFunc = key => {
    const _key = key;
    return () => Records.get(_key);
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