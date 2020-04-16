export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 80,
  auth: {
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
    projectId: process.env.PROJECT_ID,
  },
  db: {},
});
