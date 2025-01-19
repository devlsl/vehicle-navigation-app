/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_CLIENT_URL: string;
  readonly VITE_CLIENT_PORT: string;
  readonly VITE_STATIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
