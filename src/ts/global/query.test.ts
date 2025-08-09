// @vitest-environment jsdom

import { expect, test } from "vitest";
import { query } from "./query";

test("query", () => {
  expect(query("body")).toBeInstanceOf(HTMLElement);
});

test("query with context", () => {
  const div = document.createElement("div");
  div.innerHTML = '<div id="test"></div>';
  expect(query("#test", div)).toBeInstanceOf(HTMLElement);
});

test("query with context and multiple elements", () => {
  const div = document.createElement("div");
  div.innerHTML = '<div id="test"></div><div id="test2"></div>';
  expect(query("#test", div)).toBeInstanceOf(HTMLElement);
  expect(query("#test2", div)).toBeInstanceOf(HTMLElement);
});
