const createWorker = (task) => {
    const code = task.toString();
    const script = [ '('+code+')()'];
    const blob = new Blob(script);
    return new Worker(URL.createObjectURL(blob));
}

const startAsyncJob = (task, data) => {
    return new Promise((resolve, reject) => {
        let worker = createWorker(task);
        let result;
        worker.onmessage = (e) => {
            result = e.data;
            resolve(result);
            e.target.terminate();
        }
        worker.postMessage(data);
    })
}

export default startAsyncJob;