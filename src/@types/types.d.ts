/// <reference types="vite/client" />
import { ComfyApp } from "@comfyorg/comfyui-frontend-types";

declare global {
  interface Window {
    comfyAPI: {
      app: {
        app: ComfyApp;
      };
    };
  }
}
