import "./LearningMaterialList.css"
import { preventDefaults, getFilesFromEvent } from "../../modules/common/event.js";
import createWorker from "../../modules/WebWorker.js";
import base64Job from "../../modules/file2base64-job.js";
import {useState} from "react";
import { useRecords } from "../../modules/common/storage.js";
import { realDOM } from "../../modules/common/real_dom.js";

import { getFlashCard } from "../../modules/server-side-api.js";
import { logger } from "../../modules/common/log.js";

const LearningMaterialList = (props) => {
    const $ = realDOM(props);
    const ref = $.useRef();

    const records = useRecords('base64');
    const [counter, setCounter] = useState(0);
    const [ files, setFiles ] = useState([]);
    function processFiles(files) {
        for (let file of files) {
            setCounter(counter => counter + 1);
            let worker = createWorker(base64Job);
            worker.onmessage = (e) => {
                records.base64 = e.data;
                setCounter(counter => counter - 1);
                e.target.terminate();
            }
            worker.postMessage({ file: file })
        }
        if (files.length > 0) {
            setFiles(currentFiles => [...currentFiles, ...files])
        }
    }

    function addLearningMaterial(e) {
        preventDefaults(e);
        let files = getFilesFromEvent(e);
        processFiles(files);
    }

    async function generateFlashCard() {
        logger.info(records.base64);
        await getFlashCard({ file: records.base64 }).then(
            (result) => {
                let data = result.data;
                let jsonString = data.substring(data.indexOf("["), data.indexOf("]") + 1);
                props.records.questions = JSON.parse(jsonString);
            })
    }

    const generate = async e => {
        let button = $.getByRef(ref);
        let text = button.innerText;
        button.classList.add("waiting");
        button.innerText = "Processing...";
        await generateFlashCard();
        button.classList.remove("waiting");
        button.innerText = text;
    }

    const cls_name = "learning-material-list"

    let items = files.map((item, i) => <li key={i}>{item.name}</li>)
    let list = <ul>{items}</ul>
    let prompt =
        <div className="prompt">
            <button
                {...ref}
                className="generate-button"
                onClick={generate}
            >
                Get flash card
            </button>
        </div>
    return (
        <section className={cls_name}>
            <div className="material-list" >
                <input
                    type='file'
                    accept={'application/pdf'}
                    onChange={addLearningMaterial}
                    id='file-input'
                    multiple />
                <label
                    htmlFor='file-input'
                    onDragOver={preventDefaults}
                    onDragEnter={preventDefaults}
                    onDragLeave={preventDefaults}
                    onDrop={addLearningMaterial}
                >
                    <div>
                        <h3 className='symbol'>+</h3>
                        <h3>Add your files here</h3>
                        {items.length > 0 ? list : null}
                    </div>
                </label>
            </div>
            {items.length > 0 && counter === 0 ? prompt : null}
        </section>
    )
}
export default LearningMaterialList