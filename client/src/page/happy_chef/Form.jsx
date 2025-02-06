import './Form.css';

const Form = ({ handleSubmit }) => {
    const form_class = "add-ingredient-form"

    return (
        <section className={form_class} >
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="e.g oregano"
                    aria-label="Add Ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
        </section>
    )
}
export default Form
