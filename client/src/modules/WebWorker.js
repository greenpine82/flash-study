const createWorker = (task) => {
    const code = task.toString();
    const script = [ '('+code+')()'];
    const blob = new Blob(script);
    return new Worker(URL.createObjectURL(blob));
}
export default createWorker;