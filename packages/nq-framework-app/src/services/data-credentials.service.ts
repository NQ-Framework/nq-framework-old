import { DataCredentials, DataCredentialsType } from '@nqframework/models';
import { getUserToken } from './get-user-token';

const url = process.env.REACT_APP_API_URL;
export class DataCredentialsService {
  async getDataCredentialsTypes(): Promise<DataCredentialsType[]> {
    const token = await getUserToken();
    const res = await fetch(url + `/data-credentials/types`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  }
  async createDataCredentialType(newType: DataCredentialsType): Promise<void> {
    const token = await getUserToken();
    const res = await fetch(url + `/data-credentials/types`, {
      method: 'POST',
      body: JSON.stringify(newType),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  }

  async createDataCredentials(
    newCredentials: DataCredentials,
    organizationId: string,
  ): Promise<void> {
    const token = await getUserToken();
    await fetch(url + `/data-credentials?organizationId=${organizationId}`, {
      method: 'POST',
      body: JSON.stringify(newCredentials),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
