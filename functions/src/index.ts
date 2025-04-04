/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {initializeApp} from "firebase-admin/app";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

initializeApp();
 //export const helloWorld = onRequest((request, response) => {
 //  logger.info("Hello logs!", {structuredData: true});
 //  response.send("Hello from Firebase!");
 //});

 import { Users } from "./users.js";

 export const setRol = Users.setRol;

 Users.initAdmin ();
