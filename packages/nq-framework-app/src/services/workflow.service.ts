import { Workflow } from "@nqframework/models";

const url = process.env.REACT_APP_API_URL;
export class WorkflowService {
    async getWorkflow(): Promise<Workflow> {
        const res = await fetch(url + "/workflow/s9JKbcLMio6CVC5K7nHG?organizationId=livona",
            {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNTQyN2NkMzUxMDhiNDc2NjUyMDhlYTA0YjhjYTZjODZkMDljOTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbnEtZnJhbWV3b3JrIiwiYXVkIjoibnEtZnJhbWV3b3JrIiwiYXV0aF90aW1lIjoxNjA1NzQ3NzQzLCJ1c2VyX2lkIjoic1FHQzFLZmZ1eVc5ZDN0RHY2U29hZU1vMnVjMiIsInN1YiI6InNRR0MxS2ZmdXlXOWQzdER2NlNvYWVNbzJ1YzIiLCJpYXQiOjE2MDU3NDc3NDMsImV4cCI6MTYwNTc1MTM0MywiZW1haWwiOiJtaWxvcy5zLnBmY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtaWxvcy5zLnBmY0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.HntGwzDOQG2R9ita6xvv6TvUEf6RFuNC62zR6tBax-LfQpXrlfn5hhveXMLErJcDjs3f-r6-AzBvLmDLlhPDO0YKb4OiRAH4_xIXfLGUgj9aUIOlKztkSPG12zONst_Y1r_aXfrJdGALTrCWLDW-U01oB2HWRFlKP8GzAWCiMIl7GIq1Osy2lXYd9Hnykz5t6WzHL0PRepw7yUq8jNakYOcSfyaQfvExZVbdPGW9fCIPWyRzXrOBMVS22krOVNQ1cN1wZObGcUmmhCEv3fFy2sQglPm6oetx0rwnewlgcle-miBmnlQV_CpkNmeVD7yvvlSnDr9HG1M8sWDN-hzNYg',
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