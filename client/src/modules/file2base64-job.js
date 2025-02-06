export default () => {
    self.onmessage = async (e) => {
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                base64: reader.result.split(',')[1]
            });
            reader.readAsDataURL(file);
        });

        let file = e.data.file;
        let base64File = await toBase64(file);
        postMessage(base64File);
    }
}
