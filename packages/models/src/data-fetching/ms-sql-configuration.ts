export type MsSqlConfiguration = {
  type: "mssql";
  serverIp: string;
  username: string;
  password: string;
  database: string;
  trustServerCertificate: boolean;
};
