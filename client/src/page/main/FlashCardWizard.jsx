import {useNavigate} from "react-router-dom";
import { useEffect, useSyncExternalStore } from "react";
import {useRecords} from "../../modules/common/storage.js";

import logo from '../../assets/book.svg'
import Header from "../../components/Header.jsx";

import LearningMaterialList from "./LearningMaterialList.jsx";
import FlashCardDeck from "./FlashCardDeck.jsx";
import {getCurrentAuth} from "../../modules/server-side-api.js";

const FlashCardWizard = () => {
    const navigate = useNavigate();
    const auth = getCurrentAuth();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/login');
            }
        })
    }, [auth, navigate]);

    let records = useRecords('questions');
    let cards = useSyncExternalStore(...records.getHooks('questions'));

    return (
        <>
            <Header
                title="Flash Card Wizard"
                logo={logo}
            />
            <LearningMaterialList records={records} />
            { cards?.length > 0 ? <FlashCardDeck data={cards} /> : null }
        </>
    )
}

export default FlashCardWizard;