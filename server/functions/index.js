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

import { GoogleAIClient } from "./modules/google-ai.js";
import { ClaudeAIClient } from "./modules/claude-ai.js";

const CORS = ['http://localhost:5173', 'https://greenpine82.site']

export const getRecipe = onCall(
    {
        cors: CORS,
        secrets: [claudeKey]
    },
    async (request) => {
        try {
            const AI = new ClaudeAIClient(claudeKey.value())
            const ingredients = request.data.ingredients.join(", ");
            return await AI.createRecipe(ingredients);
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
            const AI = new GoogleAIClient(geminiKey.value())
            const file = request.data.file;
            return await AI.createFlashCardFromFile(file);
        }
        catch (error) {
            logger.error(error);
            throw new HttpsError("unknown", error.toString());
        }
    }
)

export const getFillBlankQuestions = onCall(
    {
        cors: CORS,
        secrets: [geminiKey]
    },
    async (request) => {
        try {
            const AI = new GoogleAIClient(geminiKey.value())
            const questions = request.data.questions;
            return await AI.convertToFillBlankQuestions(questions);
        }
        catch (error) {
            logger.error(error);
            throw new HttpsError("unknown", error.toString());
        }
    }
)
