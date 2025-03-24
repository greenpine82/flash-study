import {preventDefaults, getFilesFromEvent} from "../../modules/common/event.js";
import styles from "./LearningMaterialList.module.css";

let self;
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
                    {self.files.length > 0 ? null : <h4>ADD YOUR FILE HERE</h4>}
                    {self.files.length > 0 ? self.list : null}
                </div>
            </label>
        </div>
        {self.files.length > 0 && self.counter === 0 ? prompt() : null}
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
import startAsyncJob from "../../modules/WebWorker.js";
import convertTobase64 from "../../modules/file2base64-job.js";
import {useRef, useState} from "react";

import {createFlashCard, createFillBlankQuestions} from "../../modules/server-side-api.js";
import {logger} from "../../modules/common/log.js";
import useSelfPointer from "../../modules/common/react-self-reference.js";

const LearningMaterialList = (props) => {
    self = useSelfPointer(useRef({...props}));
    self.ref = self.useHtmlElement('button');

    [self.counter, self.setCounter] = useState(0);
    [self.files, self.setFiles] = useState([]);

    function processFiles(files) {
        for (let file of files) {
            self.setCounter(counter => counter + 1);
            startAsyncJob(convertTobase64, {file: file}).then(result => {
                self.base64 = result;
                self.setCounter(counter => counter - 1);
            })
        }
        if (files.length > 0) {
            //setFiles(currentFiles => [...currentFiles, ...files])
            self.setFiles(() => [...files])
        }
    }

    self.addLearningMaterial = (e) => {
        preventDefaults(e);
        const files = getFilesFromEvent(e);
        processFiles(files);
    }

    async function generateFlashCard() {
        logger.info(self.base64);
        props.records.questions = [];
        const construct_response_questions = await createFlashCard(self.base64);
        const fill_blank_questions = compose(await createFillBlankQuestions(construct_response_questions))
        props.records.questions = [...construct_response_questions, ...fill_blank_questions];
    }

    self.generate = async () => {
        let text = self.button.innerText;
        self.button.classList.add(styles.waiting);
        self.button.innerText = "Processing...";
        try {
            await generateFlashCard();
        }
        finally {
            self.button.classList.remove(styles.waiting);
            self.button.innerText = text;
        }
    }

    const items = self.files.map((item, i) => <li key={i}>{item.name}</li>)
    self.list = <ul>{items}</ul>

    return self.render(template);
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