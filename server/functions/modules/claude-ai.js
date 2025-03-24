import Anthropic from "@anthropic-ai/sdk";
import logger from "firebase-functions/logger";

export class ClaudeAIClient {

    constructor(apiKey) {
        this.anthropic = new Anthropic({apiKey: apiKey});
    }

    async createRecipe(ingredients) {
        const prompt = `Provide an recipe with ${ingredients} in markdown format!`
        let msg = await this.anthropic.messages.create({
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });
        logger.info(msg);
        return msg;
    }
}
