import GUN from "gun/gun";
import { writable } from "svelte/store";
import "gun/sea";
import "gun/axe";

export const timestate = GUN.state();

export const gun = GUN();

export const user = gun.user().recall({ sessionStorage: true });

export const username = writable("");

user.get("alias").on((v: string) => username.set(v));

gun.on("auth", async () => {
  const alias = await user.get("alias");
  username.set(alias);
});
