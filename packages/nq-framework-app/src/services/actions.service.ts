import { Action } from "@nqframework/models";
import { getUserToken } from "./get-user-token";

const url = process.env.REACT_APP_API_URL;
export class ActionsService {
    async getAll(): Promise<Action[]> {
        const token = await getUserToken();
        const res = await fetch(url + "/actions?organizationId=livona",
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
        const data = await res.json()
        return data;
    }
}