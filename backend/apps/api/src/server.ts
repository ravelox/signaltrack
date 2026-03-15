import { buildApp } from "./app/buildApp.js";

const start = async () => {
  const app = await buildApp();
  await app.listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
