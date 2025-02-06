import Markdown from 'react-markdown'
import "./RecipeDetails.css"

const RecipeDetails = ({ data }) => {
    const cls_name = "chef-ai-recipe"
    let answers = data.map(item => item.text).join("\n\n")
    console.log(answers)
    return (
        <section className={cls_name}>
            <div>
                <Markdown>{answers}</Markdown>
            </div>
        </section>
    )
}
export default RecipeDetails;