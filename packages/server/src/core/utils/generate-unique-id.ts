import { getFirebaseApp } from "../../firebase/initialize"
export const generateUniqueId = async (): Promise<string> => {
    const app = await getFirebaseApp()
    return app.firestore().collection("asd").doc().id;
}