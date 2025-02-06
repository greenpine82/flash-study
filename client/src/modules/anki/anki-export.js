import Exporter from './exporter';
import createTemplate from './template';
import { initSqlJs } from '../sql/sql-wasm.js';
import { saveAs } from 'file-saver';

const createAnkiDeck = async (deckName, template) => {
    let sql = await initSqlJs({ locateFile: filename => `${filename}` })
    return new Exporter(deckName, {
        template: createTemplate(template),
        sql
    });
}

export const exportAnkiDeck = async (data) => {
    const apkg = await createAnkiDeck('test');

    data.forEach(item => {
        apkg.addCard(item['Q'], item['A'])
    })

    apkg
        .save()
        .then(zip => {
            saveAs(zip, 'anki.apkg');
        })
        .catch(err => console.log(err.stack || err));
}