/// <reference types="astro/client" />
/// <reference path="./types/index.d.ts">

declare namespace astroHTML.JSX {
  interface ScriptHTMLAttributes {
    blocking?: string;
  }
}
