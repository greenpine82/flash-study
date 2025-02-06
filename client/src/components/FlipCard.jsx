import './FlipCard.css';
import {realDOM} from '../modules/common/real_dom.js';

const FlipCard = (props) => {
    const $ = realDOM(props)
    const { font, back, display } = props;

    const handleFlip = () => {
        if ($.this.classList.contains('flipped')) {
            $.this.classList.remove('flipped');
            return
        }
        $.this.classList.add('flipped');
    };
    const cls_name = 'flip-card';
    return $.new(
        <div
            className={cls_name}
            onClick={handleFlip}
            hidden={!display}
        >
            <div className='font'>
                <p>{font}</p>
            </div>
            <div className='back'>
                <p>{back}</p>
            </div>
        </div>
    )
}
export default FlipCard;