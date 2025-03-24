import {GoogleGenerativeAI} from "@google/generative-ai";
import logger from "firebase-functions/logger";

export class GoogleAIClient {

    constructor(apiKey) {
        this.geminiAI = new GoogleGenerativeAI(apiKey);
        this.model = this.geminiAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
    }

    async convertToFillBlankQuestions(questions) {
        const str = questions.map(item => `Question:\n${item['Q']}\nAnswer:\n${item['A']}`);
        const content = str.join('\n');
        const prompt =
            `Convert below Q&A items to Fill-in-the-Blanks questions in JSON format which has 2 fields "Q" as string and "A" as array.\n` +
            content;
        const result = await this.model.generateContent([
            prompt
        ]);

        logger.info(result.response.text());

        return result.response.text();
    }

    async createFlashCardFromFile(file) {
        const prompt = `Provide constructed-response questions in JSON format which has 2 fields "Q" and "A".`
        const result = await this.model.generateContent([
            {
                inlineData: {
                    data: file.base64,
                    mimeType: file.type
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
