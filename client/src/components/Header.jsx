import './Header.css'
import {realDOM} from "../modules/common/real_dom.js";

const Header = (props) => {
    const $ = realDOM(props)

    const css_class = 't-header'
    return $.new(
        <header className={css_class} >
            <img
                src={props.logo}
                alt="React Logo"
            />
            <h1>{props.title}</h1>
        </header>
    )
}

export default Header;