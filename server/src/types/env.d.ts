declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    COOKIE_NAME: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
    CORS_ORIGIN: string;
  }
}