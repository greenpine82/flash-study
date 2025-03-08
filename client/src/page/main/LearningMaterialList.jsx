import {preventDefaults, getFilesFromEvent} from "../../modules/common/event.js";
import styles from "./LearningMaterialList.module.css"

let self = {}
const template = () =>
    <section className={styles.main}>
        <div className={styles.container}>
            <input
                type='file'
                accept={'application/pdf,text/plain,audio/mpeg'}
                onChange={self.addLearningMaterial}
                id='file-input'
            />
            <label
                htmlFor='file-input'
                onDragOver={preventDefaults}
                onDragEnter={preventDefaults}
                onDragLeave={preventDefaults}
                onDrop={self.addLearningMaterial}
            >
                <div className={styles.area}>
                    <div className={styles.symbol}></div>
                    {self.items.length > 0 ? null : <h4>ADD YOUR FILE HERE</h4>}
                    {self.items.length > 0 ? self.list : null}
                </div>
            </label>
        </div>
        {self.items.length > 0 && self.counter === 0 ? prompt() : null}
    </section>

const prompt = () =>
    <div className={styles.prompt}>
        <button
            {...self.ref}
            onClick={self.generate}
        >
            Get flash card
        </button>
    </div>

//<editor-fold desc="Scripts">
import createWorker from "../../modules/WebWorker.js";
import base64Job from "../../modules/file2base64-job.js";
import {useState} from "react";
import {useRecords} from "../../modules/common/storage.js";
import {realDOM} from "../../modules/common/real_dom.js";

import {createFlashCard, createFillBlankQuestions} from "../../modules/server-side-api.js";
import {logger} from "../../modules/common/log.js";

const LearningMaterialList = (props) => {
    const $ = realDOM(props);
    self.ref = $.useRef();

    const records = useRecords('base64');
    let setCounter;
    [self.counter, setCounter] = useState(0);
    const [files, setFiles] = useState([]);

    function processFiles(files) {
        for (let file of files) {
            setCounter(counter => counter + 1);
            let worker = createWorker(base64Job);
            worker.onmessage = (e) => {
                records.base64 = e.data;
                setCounter(counter => counter - 1);
                e.target.terminate();
            }
            worker.postMessage({file: file})
        }
        if (files.length > 0) {
            //setFiles(currentFiles => [...currentFiles, ...files])
            setFiles(() => [...files])
        }
    }

    self.addLearningMaterial = (e) => {
        preventDefaults(e);
        const files = getFilesFromEvent(e);
        processFiles(files);
    }

    async function generateFlashCard() {
        logger.info(records.base64);
        props.records.questions = [];
        const construct_response_questions = await createFlashCard(records.base64);
        const fill_blank_questions = compose(await createFillBlankQuestions(construct_response_questions))
        props.records.questions = [...construct_response_questions, ...fill_blank_questions];
    }

    self.generate = async () => {
        let button = $.getByRef(self.ref);
        let text = button.innerText;
        button.classList.add(styles.waiting);
        button.innerText = "Processing...";
        try {
            await generateFlashCard();
        }
        finally {
            button.classList.remove(styles.waiting);
            button.innerText = text;
        }
    }

    self.items = files.map((item, i) => <li key={i}>{item.name}</li>)
    self.list = <ul>{self.items}</ul>

    return template()
}
export default LearningMaterialList;

function compose(questions) {
    const emoji = 0x1F449;
    return questions.map(i => {
        const pattern = /_{3,}/
        const str = i['Q'].match(pattern);
        let answer = i['Q'];
        for (let a of i['A']) {
            answer = answer.replace(str, String.fromCodePoint(emoji) + a);
        }
        return {
            Q: i['Q'],
            A: answer
        }
    })
}
//</editor-fold>