import Header from "../../components/Header.jsx";
import LearningMaterialList from "./LearningMaterialList.jsx";
import FlashCardDeck from "./FlashCardDeck.jsx";
import logo from '../../assets/book.svg'

let self = {}
const template = () =>
    <>
        <Header
            title="Flash Study"
            logo={logo}
        />
        <LearningMaterialList records={self.records} />
        { self.cards?.length > 0 ? <FlashCardDeck data={self.cards} /> : null }
    </>

//<editor-fold desc="Scripts">
import {useNavigate} from "react-router-dom";
import { useEffect, useSyncExternalStore } from "react";
import {useRecords} from "../../modules/common/storage.js";
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

    self.records = useRecords('questions');
    self.cards = useSyncExternalStore(...self.records.getHooks('questions'));

    return template()
}
export default FlashCardWizard;
//</editor-fold>