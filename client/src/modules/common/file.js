export const saveFile = (content, fileName, type) => {
    let a = document.createElement("a");
    let  file = new Blob([content], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click()
}