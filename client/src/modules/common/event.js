export const preventDefaults = e => {
    e.preventDefault();
    e.stopPropagation();
}

export const getFilesFromEvent = (e) => {
    if (e.type === "change")
        return e.target.files;
    if (e.type === "drop") {
        return [...e.dataTransfer.items].map((item) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
                return item.getAsFile();
            }
        });
    }
    return [];
}