import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/login')
    }, [navigate]);
    return null;
}
export default LandingPage;