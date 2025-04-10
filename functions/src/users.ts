import admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { getAuth} from "firebase-admin/auth";
import { onCall, HttpsError} from "firebase-functions/v2/https";
//import { ModelsFunctions} from "./models";
import { ModelsFunctions } from "./models.js";

//import * as cors from "cors";
//import cors from "cors";
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const firestore = getFirestore();
const auth = getAuth();


//const corsHandler = cors({ origin: true });

 export const initAdmin = async () => {

  console.log(' initAdmin ');

  const data: ModelsFunctions.RequestSetRol = {
    roles: {
      admin: true
    },
    uid: 'EJmgLQIHuxbAJze7acrh1Fr4t2E2'
  }
  const claims = {
    roles: data.roles
  }
  await auth.setCustomUserClaims(data.uid, claims);
  await firestore.doc(`Users/${data.uid}`).update(claims)

  console.log('set claim con éxito');
  return {ok: true}

};

export const setRol = onCall({cors: true}, async (request) => {

  //if (request.auth) {
   // console.log('setRol user -> ', request.auth.token);
  //}

    let valid = true;
     // valid = await isRol(request.auth.uid, ['admin']);
    if (request?.auth?.token) {
        const token: any = request.auth.token
        // console.log('token ', token);
        if (token.roles) {
          valid = token.roles.admin
        }
        if (valid) {

          const data: ModelsFunctions.RequestSetRol = request.data;
          console.log('hacer la funcion -> ', data.uid);
          const claims = {
            roles: data.roles
          }
          await auth.setCustomUserClaims(data.uid, claims);
          await firestore.doc(`Users/${data.uid}`).update(claims)

          console.log('set claim con éxito');
          return {ok: true}

        } else {
          console.log('hacer la funcion -> ', token.uid);
          const claims = {
            roles: {
              cliente: true
            }
          }
          await auth.setCustomUserClaims(token.uid, claims);
          // await firestore.doc(`Users/${token.uid}`).update(claims)
          console.log('set claim con éxito');
          return {ok: true}
        }
    }
    throw new HttpsError("permission-denied", "no es admin");
});

export const Users = {
    setRol,
    //initAdmin
}
