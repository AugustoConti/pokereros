import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Page from "../app/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => {},
  }),
}));

function HomePage() {
  return <Page onSave={async () => await Promise.resolve()} />;
}

describe("Poker", () => {
  it("Booting up the app from the index file does not break anything", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: "Pokereros" })).toBeDefined();
  });

  it("Start with $0 total balance", () => {
    render(<HomePage />);

    expect(screen.getByTestId("total-balance")).toHaveTextContent("$ 0");
  });

  it("Add player", async () => {
    render(<HomePage />);
    const user = userEvent.setup();
    const addPlayerButton = screen.getAllByRole("button", { name: /player/i })[0];

    if (!addPlayerButton) throw new Error("No add player button found");

    await user.click(addPlayerButton);
    await user.type(screen.getByRole("textbox", { name: /nombre/i }), "Player 1");
    await user.type(screen.getByRole("textbox", { name: /alias/i }), "P1");
    await user.type(screen.getByRole("spinbutton", { name: /monto/i }), "100");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    const player1seat = screen.getByTestId("seat-Player 1");

    expect(player1seat).toHaveTextContent("Player 1");
    expect(player1seat).toHaveTextContent("-$ 100");

    const player1 = screen.getByTestId("player-Player 1");

    expect(player1).toHaveTextContent("Player 1");
    expect(player1).toHaveTextContent("-$ 100");

    expect(screen.getByTestId("total-balance")).toHaveTextContent("$ 100");

    expect(screen.getByText(/player 1 entró con \$ 100/i)).toBeInTheDocument();
  });
});
