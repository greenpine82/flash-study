import {GoogleGenerativeAI} from "@google/generative-ai";
import logger from "firebase-functions/logger";

export const GoogleAI = {
    init: initModel,
    createRecipe: createRecipe,
    createFlashCardFromPDF: createFlashCardFromPDF
};

async function createFlashCardFromPDF(file) {
    const prompt = `Provide constructed-response questions in JSON format which has 2 fields "Q" and "A".`
    const result = await model.generateContent([
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

async function createRecipe(ingredients){
    const prompt = `Provide an recipe with ${ingredients} in markdown format!`
    const result = await model.generateContent([
        prompt
    ]);
    logger.info(result.response.text());
    return result.response.text();
}

let geminiAI = null;
let model = null;
function initModel(key) {
    geminiAI = geminiAI || new GoogleGenerativeAI(key);
    model = model || geminiAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
}