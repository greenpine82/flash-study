import './LoginPage.css';
import GoogleLoginButton from "../../components/GoogleLoginButton.jsx";

const LoginPage = () => {
    const cls_name_page = "login-page";

    return (
        <div className={cls_name_page}>
            <div className="login-container">
                <LoginForm/>
                <hr className="hr-text" data-content={"OR"}/>
                <GoogleLoginButton entry={'/main'} />
            </div>
        </div>
    );
}

export default LoginPage;

const LoginForm = () => {
    return (
        <form className="login-form">
            <input
                type="text"
                placeholder="ID"
                name="id"
            />
            <input
                type="text"
                placeholder="Password"
                name="password"
            />
            <button>Log in</button>
        </form>
    )
}