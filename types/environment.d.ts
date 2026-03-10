export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
      NEXT_PUBLIC_API_URL: string;
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;
    }
  }
}
