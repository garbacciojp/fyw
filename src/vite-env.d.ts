/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables
 * ⚠️ OpenAI credentials are NOT in the widget - they're on the server only!
 */
interface ImportMetaEnv {
  // API Base URL - our backend server that proxies to OpenAI
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEBUG_MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


