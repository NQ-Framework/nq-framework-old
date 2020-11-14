import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export function loadSecretManagerValues(): Promise<void[]> {
  const secrets = [
    {
      name: 'server_firebase_private_key',
      env: 'PRIVATE_KEY',
    },
    {
      name: 'server_ga_api_key',
      env: 'GA_API_SECRET',
    },
  ];
  const client = new SecretManagerServiceClient();
  const promises = secrets.map((s) => {
    const name = `projects/nq-framework/secrets/${s.name}/versions/latest`;
    return client.accessSecretVersion({ name }).then(([version]) => {
      if (version && version.payload && version.payload.data) {
        const secretValue = version.payload.data.toString();
        process.env[s.env] = secretValue;
        console.log(`Loaded secret value for ${s.name} from secret manager`);
      } else {
        console.error(
          `Tried to load secret value for ${s.name} from secret manager but failed.`,
        );
      }
    });
  });
  return Promise.all(promises);
}
