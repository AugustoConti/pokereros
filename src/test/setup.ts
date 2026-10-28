import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import "@/lib/zod";

// jsdom doesn't implement scrolling, which the router calls on navigation.
vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  localStorage.clear();
});
