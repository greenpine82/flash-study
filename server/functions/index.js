/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError } from "firebase-functions/v2/https";
import { onCall } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";

import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({
    maxInstances: 2,
    region: "asia-east1"
});

import  { defineSecret } from 'firebase-functions/params';

const geminiKey = defineSecret('GREENPINE82_GEMINI_KEY');
const claudeKey = defineSecret('GREENPINE82_CLAUDE_KEY');

const CORS = ['http://localhost:5173', 'https://greenpine82.site']

import { GoogleAI } from "./modules/google-ai.js";
import { ClaudeAI } from "./modules/claude-ai.js";

export const getRecipe = onCall(
    {
        cors: CORS,
        secrets: [claudeKey]
    },
    async (request) => {
        try {
            let ingredients = request.data.ingredients.join(", ");
            ClaudeAI.init(claudeKey.value())
            return await ClaudeAI.createRecipe(ingredients);
        }
        catch (error) {
            logger.error(error);
            throw new HttpsError("unknown", error.toString());
        }
    }
);

export const getFlashCard = onCall(
    {
        cors: CORS,
        secrets: [geminiKey]
    },
    async (request) => {
        try {
            let pdfFile = request.data.file;
            logger.info(pdfFile);
            GoogleAI.init(geminiKey.value())
            return await GoogleAI.createFlashCardFromPDF(pdfFile);
        }
        catch (error) {
            logger.error(error);
            throw new HttpsError("unknown", error.toString());
        }
    }
)
