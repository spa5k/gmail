declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LABEL_TO_WATCH: string;
    }
  }
}

export {};
