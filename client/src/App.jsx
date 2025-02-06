import {createRoot} from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChefClaude from "./page/happy_chef/ChefClaude.jsx";
import LoginPage from "./page/login/LoginPage.jsx";
import LandingPage from "./page/landing/LandingPage.jsx";
import {StrictMode} from "react";
import FlashCardWizard from "./page/main/FlashCardWizard.jsx";
import Playground from "./page/test/Playground.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/chef" element={<ChefClaude />} />
                <Route path="/main" element={<FlashCardWizard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/test" element={<Playground />} />
            </Routes>
        </Router>
    )
}

createRoot(document.getElementById("root"))
    .render(
        <App />
    )
