import { defineConfig, loadEnv, Environment } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default (envs: Environment) => {
  process.env = { ...process.env, ...loadEnv(envs.mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(process.env.VITE_CLIENT_PORT),
    },
  });
};
