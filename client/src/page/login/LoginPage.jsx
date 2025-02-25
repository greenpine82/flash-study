import './LoginPage.css';
import GoogleLoginButton from "../../components/GoogleLoginButton.jsx";
import { useNavigate } from 'react-router-dom';
import { signIn } from "../../modules/server-side-api.js";

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
    const navigate = useNavigate();
    const logIn = async (e) => {
        e.preventDefault();
        let formElement = e.currentTarget;
        const id = new FormData(formElement).get('id');
        const pass = new FormData(formElement).get('password');
        try {
            const result = await signIn(id, pass);
            navigate('/main');
        } catch (error) {
            prompt(error.message);
        }
    };
    return (
        <form
            className="login-form"
            onSubmit={logIn}
        >
            <input
                type="text"
                placeholder="ID"
                name="id"
            />
            <input
                type="password"
                placeholder="Password"
                name="password"
            />
            <button>Log in</button>
        </form>
    )
}