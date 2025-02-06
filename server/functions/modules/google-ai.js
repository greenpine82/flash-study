import {GoogleGenerativeAI} from "@google/generative-ai";
import logger from "firebase-functions/logger";

export class GoogleAIClient {

    constructor(apiKey) {
        this.geminiAI = new GoogleGenerativeAI(apiKey);
        this.model = this.geminiAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    }

    async createFlashCardFromPDF(file) {
        const prompt = `Provide constructed-response questions in JSON format which has 2 fields "Q" and "A".`
        const result = await this.model.generateContent([
            {
                inlineData: {
                    data: file.base64,
                    mimeType: "application/pdf",
                },
            },
            prompt,
        ]);
        logger.info(result.response.text());
        return result.response.text();
    }

    async createRecipe(ingredients){
        const prompt = `Provide an recipe with ${ingredients} in markdown format!`
        const result = await this.model.generateContent([
            prompt
        ]);
        logger.info(result.response.text());
        return result.response.text();
    }
}
