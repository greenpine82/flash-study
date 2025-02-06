import Anthropic from "@anthropic-ai/sdk";
import logger from "firebase-functions/logger";

let anthropic = null;

const createRecipe = async (ingredients) => {
    const prompt = `Provide an recipe with ${ingredients} in markdown format!`
    let msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
    });
    logger.info(msg);
    return msg;
}

export const ClaudeAI = {
    init: key => anthropic = anthropic || new Anthropic({apiKey: key}),
    createRecipe: createRecipe
};