import './Header.css'

const Header = (props) => {
    const css_class = 't-header'
    return (
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