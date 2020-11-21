import { Action } from "@nqframework/models";

const url = process.env.REACT_APP_API_URL;
const token = process.env.REACT_APP_TOKEN;
export class ActionsService {
    async getAll(): Promise<Action[]> {
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