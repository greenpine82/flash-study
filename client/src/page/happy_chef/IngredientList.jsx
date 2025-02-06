import "./IngredientList.css"

const IngredientList = ({ data, handleGenerate }) => {
    const ingredients_class = "ingredient-list"

    let items = data.map((item, i) => <li key={i}>{item}</li>)
    let list = <ul>{items}</ul>
    return (
        <section className={ingredients_class}>
            <h1>Ingredients on hand:</h1>
            {list}
            <div className="recipe">
                <div className="description">
                    <h3>Ready for recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button
                    className="generate-button"
                    onClick={handleGenerate}
                >
                    Get a recipe
                </button>
            </div>
        </section>
    )
}
export default IngredientList