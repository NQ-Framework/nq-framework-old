export type MsSqlConfiguration = {
  type: "mssql";
  serverIp: string;
  port: string;
  username: string;
  password: string;
  database: string;
  trustServerCertificate: boolean;
};
