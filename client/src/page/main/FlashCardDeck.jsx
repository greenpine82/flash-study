import './FlashCardDeck.css'
import FlipCard from "../../components/FlipCard.jsx";
import {realDOM} from "../../modules/common/real_dom.js";
import { animate } from "../../modules/common/animation.js";
import { exportAnkiDeck } from "../../modules/anki/anki-export.js";
import {saveFile} from "../../modules/common/file.js";

const FlashCardDeck = (props) => {
    const $ = realDOM(props);
    const ref = $.useRef();
    const { data } = props;
    const cls_name = 'flash-card-deck';
    let index = 0;
    let flashCards = data.map((item, i) => {
        return $.create(<FlipCard key={i} font={item['Q']} back={item['A']} display={i === 0}/>)
    })

    const transition = (exit, enter, getNext) => {
        let nextIndex = getNext(index);
        let card = $.get(flashCards[index])
        let nextCard = $.get(flashCards[nextIndex])
        let number = $.getByRef(ref)

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
        const next_end = () => { nextCard?.classList.remove(enter) };

        animate(card, start, end)
            .then(nextCard, next_start, next_end)
            .start()
        number.innerHTML = `${nextIndex + 1} / ${flashCards.length}`;
        index = nextIndex;
    };
    const nextCard = (e) => {
        e.stopPropagation()
        transition(
            'fade-out-left',
            'fade-in-right',
            i => (i + 1) % flashCards.length)
    };
    const prevCard = (e) => {
        e.stopPropagation()
        transition(
            'fade-out-right',
            'fade-in-left',
            i => (i - 1 + flashCards.length) % flashCards.length)
    };
    const clickHandler = () => {
        $.get(flashCards[index]).click()
    }
    const exportFile = async (e) => {
        e.stopPropagation();
        await exportAnkiDeck(data);
    }
    const saveToFile = e => {
        e.stopPropagation();
        saveFile(JSON.stringify(data), 'questions.json', 'text/plain');
    }
    let control =
        <div
            onClick={clickHandler}
            className="control"
            style={{opacity: OpacityValue}}
        >
            <div
                className="button prev"
                onClick={prevCard}
            />
            <h5 {...ref} hidden>{`${index + 1} / ${flashCards.length}`}</h5>
            <div
                className="button next"
                onClick={nextCard}
            />
            <div
                className="button-save"
                onClick={saveToFile}
            >
                Save
            </div>
            <div
                className="button-export"
                onClick={exportFile}
            >
                Export
            </div>
        </div>
    return $.new(
        <section className={cls_name}>
            {flashCards}
            {control}
        </section>
    )
}
export default FlashCardDeck;

function isMobile() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        // true for mobile device
        return true;
    }
    return false;
}

const OpacityValue =  isMobile() ? 1 : 0