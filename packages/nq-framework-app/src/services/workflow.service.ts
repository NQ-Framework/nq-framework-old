import { Workflow } from "@nqframework/models";

const url = process.env.REACT_APP_API_URL;
export class WorkflowService {
    async getWorkflow(): Promise<Workflow> {
        const res = await fetch(url + "/workflow/s9JKbcLMio6CVC5K7nHG?organizationId=livona",
            {
                headers: {
                    'Authorization': 'Bearer "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNTQyN2NkMzUxMDhiNDc2NjUyMDhlYTA0YjhjYTZjODZkMDljOTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbnEtZnJhbWV3b3JrIiwiYXVkIjoibnEtZnJhbWV3b3JrIiwiYXV0aF90aW1lIjoxNjA1NzgwMjcxLCJ1c2VyX2lkIjoic1FHQzFLZmZ1eVc5ZDN0RHY2U29hZU1vMnVjMiIsInN1YiI6InNRR0MxS2ZmdXlXOWQzdER2NlNvYWVNbzJ1YzIiLCJpYXQiOjE2MDU3ODAyNzEsImV4cCI6MTYwNTc4Mzg3MSwiZW1haWwiOiJtaWxvcy5zLnBmY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtaWxvcy5zLnBmY0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.UcY-k8jMVQYJmCm2_km0X0aCf-BNEscJotMFm-EpFSqvfKSD8AS3pn2u0Ye0DLHcBcY7O4rHhapwv_7rD1EMeoYeM-auS6BsuTSGW8B_ZVnx8JT7KNOG70lJ8gFkZGyMN3KgJNJXHo3RDWM68KLSGRt95rAYR5sIUzDAYCQ3HX1VepoWsNW0XvqguN2G-uwrOTUAzvZqukA5PnLq1vlmMmNuf2_6dNR3ED_1pdhUPC5ntyWkfAKkR291RTOgbE8uz5OVg6dPQWM28waetTeuttNvyJ9oerjWfAhoap2-Ejfc_5lw0iMxgjik03ozPSwJUc6sI6WQTn3TESPHORMmbw',
                    'Accept': '*/*'
                }
            });
        if (res.status !== 200) {
            throw new Error('not found');
        }
        const data = await res.json()
        return data;
    }
}