import './FlashCardDeck.css'

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const OpacityValue = isMobile() ? 1 : 0
let self = {}

const template = () =>
    <section className='flash-card-deck'>
        {self.flashCards}
        {buttons()}
    </section>

const buttons = () =>
    <div
        onClick={self.clickHandler}
        className="buttons"
        style={{opacity: OpacityValue}}
    >
        <div
            className="round prev"
            onClick={self.prevCard}
        />
        <h5 {...self.ref} hidden>{`${self.index + 1} / ${self.flashCards.length}`}</h5>
        <div
            className="round next"
            onClick={self.nextCard}
        />
        <div
            className="save"
            onClick={self.saveToFile}
        >
            Save
        </div>
        <div
            className="export"
            onClick={self.exportFile}
        >
            Export
        </div>
    </div>

import FlipCard from "../../components/FlipCard.jsx";
import {realDOM} from "../../modules/common/real_dom.js";
import {animate} from "../../modules/common/animation.js";
import {exportAnkiDeck} from "../../modules/anki/anki-export.js";
import {saveFile} from "../../modules/common/file.js";

const FlashCardDeck = (props) => {
    const $ = realDOM(props);
    self.ref = $.useRef();
    const {data} = props;
    self.index = 0;
    self.flashCards = data.map((item, i) => {
        return $.create(<FlipCard key={i} font={item['Q']} back={item['A']} display={i === 0}/>)
    })

    const transition = (exit, enter, getNext) => {
        let nextIndex = getNext(self.index);
        let card = $.get(self.flashCards[self.index])
        let nextCard = $.get(self.flashCards[nextIndex])
        let number = $.getByRef(self.ref)

        const start = () => {
            card?.classList.remove('flipped');
            card?.classList.add(exit);
        };
        const end = () => {
            card?.classList.remove(exit)
            card?.setAttribute('hidden', '');
        };
        const next_start = () => {
            nextCard?.classList.add(enter);
            nextCard?.removeAttribute('hidden');
        };
        const next_end = () => {
            nextCard?.classList.remove(enter)
        };

        animate(card, start, end)
            .then(nextCard, next_start, next_end)
            .start()
        number.innerHTML = `${nextIndex + 1} / ${self.flashCards.length}`;
        self.index = nextIndex;
    };
    self.nextCard = (e) => {
        e.stopPropagation()
        transition(
            'fade-out-left',
            'fade-in-right',
            i => (i + 1) % self.flashCards.length)
    };
    self.prevCard = (e) => {
        e.stopPropagation()
        transition(
            'fade-out-right',
            'fade-in-left',
            i => (i - 1 + self.flashCards.length) % self.flashCards.length)
    };
    self.clickHandler = () => {
        $.get(self.flashCards[self.index]).click()
    }
    self.exportFile = async (e) => {
        e.stopPropagation();
        await exportAnkiDeck(data);
    }
    self.saveToFile = e => {
        e.stopPropagation();
        saveFile(JSON.stringify(data), 'questions.json', 'text/plain');
    }

    return $.new(template())
}
export default FlashCardDeck;
