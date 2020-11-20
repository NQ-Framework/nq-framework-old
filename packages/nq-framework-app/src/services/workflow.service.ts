import { Workflow } from "@nqframework/models";
import { UpdateNodePositions } from "../types/UpdateNodePositions";

const url = process.env.REACT_APP_API_URL;
export class WorkflowService {
    async getWorkflow(): Promise<Workflow> {
        const res = await fetch(url + "/workflow/s9JKbcLMio6CVC5K7nHG?organizationId=livona",
            {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNTQyN2NkMzUxMDhiNDc2NjUyMDhlYTA0YjhjYTZjODZkMDljOTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbnEtZnJhbWV3b3JrIiwiYXVkIjoibnEtZnJhbWV3b3JrIiwiYXV0aF90aW1lIjoxNjA1ODMzNjQxLCJ1c2VyX2lkIjoic1FHQzFLZmZ1eVc5ZDN0RHY2U29hZU1vMnVjMiIsInN1YiI6InNRR0MxS2ZmdXlXOWQzdER2NlNvYWVNbzJ1YzIiLCJpYXQiOjE2MDU4MzM2NDEsImV4cCI6MTYwNTgzNzI0MSwiZW1haWwiOiJtaWxvcy5zLnBmY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtaWxvcy5zLnBmY0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.kr86nlZjUuLMgFK_Pw8AYC_H7pfMGYIbqgsO6B0qlF3lfyCX9eFgPgph2jjSOx-3gVugdkbIGsZW5rrTPF88DdqniAa59Xuqh5hv8Va_cBpRPczgpI4o58q13cc_mxXjZPR4fzCpDEbO71fFVelz7sdxyrlyPkThkEJ4mXgyS7cCxK6HO2GbG4JhFoFLwaAA7DUtDqJTdFTer0yb3U1IxEx7xpBx2mplc-LmgqgFORMHEFF_k8YSZ9U07_oPTvsDq8fDrPqAb-D8e5Oxj5aJHelrcKWNPo0C2IsqlNmaDGdtsz8ipAIVNbc-MRzlHeahWdU6O2FCXEKXmxiv9fxylQ',
                }
            });
        if (res.status !== 200) {
            throw new Error('not found');
        }
        const data = await res.json()
        return data;
    }

    async updateWorkflowNodePositions(positions: UpdateNodePositions): Promise<void> {
        const res = await fetch(url + "/workflow/s9JKbcLMio6CVC5K7nHG/positions?organizationId=livona",
            {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNTQyN2NkMzUxMDhiNDc2NjUyMDhlYTA0YjhjYTZjODZkMDljOTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbnEtZnJhbWV3b3JrIiwiYXVkIjoibnEtZnJhbWV3b3JrIiwiYXV0aF90aW1lIjoxNjA1ODMzNjQxLCJ1c2VyX2lkIjoic1FHQzFLZmZ1eVc5ZDN0RHY2U29hZU1vMnVjMiIsInN1YiI6InNRR0MxS2ZmdXlXOWQzdER2NlNvYWVNbzJ1YzIiLCJpYXQiOjE2MDU4MzM2NDEsImV4cCI6MTYwNTgzNzI0MSwiZW1haWwiOiJtaWxvcy5zLnBmY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtaWxvcy5zLnBmY0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.kr86nlZjUuLMgFK_Pw8AYC_H7pfMGYIbqgsO6B0qlF3lfyCX9eFgPgph2jjSOx-3gVugdkbIGsZW5rrTPF88DdqniAa59Xuqh5hv8Va_cBpRPczgpI4o58q13cc_mxXjZPR4fzCpDEbO71fFVelz7sdxyrlyPkThkEJ4mXgyS7cCxK6HO2GbG4JhFoFLwaAA7DUtDqJTdFTer0yb3U1IxEx7xpBx2mplc-LmgqgFORMHEFF_k8YSZ9U07_oPTvsDq8fDrPqAb-D8e5Oxj5aJHelrcKWNPo0C2IsqlNmaDGdtsz8ipAIVNbc-MRzlHeahWdU6O2FCXEKXmxiv9fxylQ',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(positions)
            });
        if (res.status !== 200) {
            throw new Error('not found');
        }
    }
}