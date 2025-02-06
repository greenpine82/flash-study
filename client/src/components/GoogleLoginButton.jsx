import './GoogleLoginButton.css';
import { useNavigate } from 'react-router-dom';
import {signInWithGoogle} from "../modules/server-side-api.js";

const GoogleLoginButton = ({ entry }) => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithGoogle();
            navigate(entry);
        } catch (error) {
            prompt(error.message);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleSignIn}
            className="login-with-google-btn"
        >
            Sign in with Google
        </button>
    );
}

export default GoogleLoginButton;