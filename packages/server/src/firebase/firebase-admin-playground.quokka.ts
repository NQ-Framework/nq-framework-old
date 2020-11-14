import { loadFirebase } from "./initialize";
import * as dotenv from "dotenv";
dotenv.config({ path: './.development.env' });

const app = loadFirebase({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY
} as any);

app.auth().getUserByEmail('milos.s.pfc@gmail.com').then(user => {
    app.auth().setCustomUserClaims(user.uid, {}).then((resp) => {
        console.log('jep', resp);
    });
});
