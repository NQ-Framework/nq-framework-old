import firebase from "firebase/app";
import 'firebase/auth';
import { initPromise } from "../firebase/firebase-context";
export const getUserToken = async (): Promise<string> => {
    await initPromise;
    const user = firebase.app().auth().currentUser;
    if (!user) {
        throw new Error('cannot get token, no user signed in.');
    }
    const token = await user.getIdToken();
    return token;
}