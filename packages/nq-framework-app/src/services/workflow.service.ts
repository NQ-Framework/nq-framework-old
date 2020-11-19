import { Workflow } from "@nqframework/models";

const url = process.env.REACT_APP_API_URL;
export class WorkflowService {
    async getWorkflow(): Promise<Workflow> {
        const res = await fetch(url + "/workflow/s9JKbcLMio6CVC5K7nHG?organizationId=livona",
            {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNTQyN2NkMzUxMDhiNDc2NjUyMDhlYTA0YjhjYTZjODZkMDljOTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbnEtZnJhbWV3b3JrIiwiYXVkIjoibnEtZnJhbWV3b3JrIiwiYXV0aF90aW1lIjoxNjA1NzQzNTAxLCJ1c2VyX2lkIjoic1FHQzFLZmZ1eVc5ZDN0RHY2U29hZU1vMnVjMiIsInN1YiI6InNRR0MxS2ZmdXlXOWQzdER2NlNvYWVNbzJ1YzIiLCJpYXQiOjE2MDU3NDM1MDEsImV4cCI6MTYwNTc0NzEwMSwiZW1haWwiOiJtaWxvcy5zLnBmY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtaWxvcy5zLnBmY0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Rib5tjP4HZYxe6MjMtj2yGP18FduPDfhoVuh30NAdDyZep58O4W1IyzCh2NqFco7fcJLdxj1Uupl2Fq468_AA1KDMXhcpjgADumQT6ugsVLOvQM54qpr-AsgOpABnpJfAEZ1ySlwsjgp_6-YjoOzOEta2jav0Lj78kieSnI__NFuku0YDrnTODRLVBfgOqovFeZ68UytGByyEJ8t95EjoESbINipnby2Nt23pCg5QuLfBBu9MYjP7UliDCF8a1LZwAfmCsuhT6KeMoMxCdMkRtwiOxWbt40RRHkPMAl-MiUkaj_kaY94093d6RHUN7llwp93HqCz7bdWmH-yngEc_g',
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