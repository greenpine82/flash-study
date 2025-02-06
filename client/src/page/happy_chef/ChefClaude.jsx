import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import logo from '../../assets/react_logo.png'
import Header from "../../components/Header.jsx";
import Form from "./Form.jsx";
import IngredientList from "./IngredientList.jsx";
import RecipeDetails from "./RecipeDetails.jsx";

import {getCurrentAuth, getRecipe} from "../../modules/server-side-api.js";

const ChefClaude = () => {
    const navigate = useNavigate();
    const auth = getCurrentAuth();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/login');
            }
        })
    }, [auth, navigate]);

    const [ ingredients, setIngredients ] = useState([]);

    function addIngredient(e) {
        e.preventDefault()
        let formElement = e.currentTarget
        const data = new FormData(formElement).get('ingredient')
        setIngredients(currentIngredients => [...currentIngredients, data])
        formElement.reset()
    }

    const [ recipe, setRecipe ] = useState([])

    async function generateRecipe() {
        let request = {
            ingredients: ingredients
        }
        getRecipe(request).then(
            response => {
                console.log(response)
                setRecipe(current_msg => [ ...current_msg, ...response.data.content ])
            }
        );
    }

    return (
        <>
            <Header
                title="Happy Chef"
                logo={logo}
            />
            <Form handleSubmit={addIngredient}/>
            { ingredients.length > 0 ? <IngredientList data={ingredients} handleGenerate={generateRecipe}/> : null }
            { recipe.length > 0 ? <RecipeDetails data={recipe} /> : null }
        </>
    )
}

export default ChefClaude;