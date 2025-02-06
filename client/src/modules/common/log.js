const logDebug = data => { produceMsg(data, levels.DEBUG); };
const logInfo = data => { produceMsg(data, levels.INFO); };
const logWarn = data => { produceMsg(data, levels.WARN); };
const logError = data => { produceMsg(data, levels.ERROR); };

export const logger = {
    debug: logDebug,
    info: logInfo,
    warn: logWarn,
    error: logError
};

const levels = {
    OFF: -1,
    ALL: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
}

const prefixes = ['DEBUG', 'INFO', 'WARNING', 'ERROR'];

let current_level = levels.ALL;

let consumers = [console.log]

const produceMsg = (data, level) => {
    let record = createRecord(data, level);
    if (!record) { return; }
    for (let consumer of consumers) {
        consumer(record);
    }
}

const createRecord = (data, level) => {
    if (level < current_level) {
        return null;
    }
    let date = new Date().toISOString();
    let timestamp = date.replace('T', ' ').replace('Z', '');
    return [
        prefixes[level - 1],
        timestamp,
        data
    ]
}
