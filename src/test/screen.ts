// jsdom doesn't implement media queries, which the drawer and the layout check. Tests run as a phone
// unless a test asks for a wide screen.
let wideScreen = false;

export function setWideScreen(value: boolean) {
  wideScreen = value;
}

export function matchMedia(query: string) {
  return {
    matches: wideScreen && query.includes("min-width"),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };
}
