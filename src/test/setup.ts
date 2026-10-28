import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import "@/lib/zod";
import { matchMedia, setWideScreen } from "@/test/screen";

// jsdom doesn't implement scrolling, which the router calls on navigation.
vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

// Nor pointer capture, which the drawer uses for its drag-to-close gesture.
Element.prototype.setPointerCapture = () => undefined;
Element.prototype.releasePointerCapture = () => undefined;
Element.prototype.hasPointerCapture = () => false;

Object.defineProperty(window, "matchMedia", { writable: true, value: matchMedia });

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  localStorage.clear();
  setWideScreen(false);
});
