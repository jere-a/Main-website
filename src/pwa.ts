// oxlint-disable no-console
import { getQueryParam } from "@utils/url";
import * as v from "valibot";
import { registerSW } from "virtual:pwa-register";

const DEFAULT_TRUTHY = ["true", "1", "yes", "on", "y", "enabled"];
const DEFAULT_FALSY = ["false", "0", "no", "off", "n", "disabled"];

function stringBool(truthy = DEFAULT_TRUTHY, falsy = DEFAULT_FALSY) {
  const values = new Set([...truthy, ...falsy]);

  return v.pipe(
    v.string(),
    v.transform((value) => value.toLowerCase()),
    v.check((value) => values.has(value), "Invalid boolean string"),
    v.transform((value) => truthy.includes(value)),
  );
}

const ServiceWorkerSchema = v.union([
  v.pipe(
    v.null(),
    v.transform(() => true),
  ),
  stringBool(),
]);

const isSW = v.parse(ServiceWorkerSchema, getQueryParam("sw"));

if (isSW) {
  registerSW({
    onRegisteredSW(swScriptUrl) {
      console.log("SW registered: ", swScriptUrl);
    },
    onOfflineReady() {
      console.log("PWA application ready to work offline");
    },
  });
}
