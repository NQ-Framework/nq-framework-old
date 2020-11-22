import { Organization } from "@nqframework/models";
import { getUserToken } from "./get-user-token";

const url = process.env.REACT_APP_API_URL;
export class UserService {
    async getOrganizations(): Promise<Organization[]> {
        const token = await getUserToken();
        const res = await fetch(url + "/profile",
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
        const data = await res.json()
        return data.organizations;
    }
}