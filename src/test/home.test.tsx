import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Home from "@/components/Home";
import { Table } from "@/models/table";

function HomePage() {
  const rootRoute = createRootRoute({
    component: () => <Home onSave={async () => await Promise.resolve()} />,
  });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return <RouterProvider router={router} />;
}

describe("Poker", () => {
  it("Booting up the app from the index file does not break anything", async () => {
    render(<HomePage />);

    expect(await screen.findByRole("heading", { level: 1, name: "Pokereros" })).toBeInTheDocument();
  });

  it("Start with $0 total balance", async () => {
    render(<HomePage />);

    expect(await screen.findByTestId("total-balance")).toHaveTextContent("$ 0");
  });

  it("Add player", async () => {
    render(<HomePage />);
    const user = userEvent.setup();
    const addPlayerButton = (await screen.findAllByRole("button", { name: /player/iu }))[0];

    if (!addPlayerButton) throw new Error("No add player button found");

    await user.click(addPlayerButton);
    await user.type(screen.getByRole("textbox", { name: /nombre/iu }), "Player 1");
    await user.type(screen.getByRole("textbox", { name: /alias/iu }), "P1");
    await user.type(screen.getByRole("spinbutton", { name: /monto/iu }), "100");
    await user.click(screen.getByRole("button", { name: /submit/iu }));

    const player1seat = screen.getByTestId("seat-Player 1");

    expect(player1seat).toHaveTextContent("Player 1");
    expect(player1seat).toHaveTextContent("-$ 100");

    const player1 = screen.getByTestId("player-Player 1");

    expect(player1).toHaveTextContent("Player 1");
    expect(player1).toHaveTextContent("-$ 100");

    expect(screen.getByTestId("total-balance")).toHaveTextContent("$ 100");

    expect(screen.getByText(/player 1 entró con \$ 100/iu)).toBeInTheDocument();
  });

  it("Allows cashing out more than the pot and only shows debts once it's back to zero", async () => {
    render(<HomePage />);
    const user = userEvent.setup();
    const addPlayer = async (name: string, amount: string) => {
      const addPlayerButton = (await screen.findAllByRole("button", { name: /player/iu }))[0];

      if (!addPlayerButton) throw new Error("No add player button found");

      await user.click(addPlayerButton);
      await user.type(screen.getByRole("textbox", { name: /nombre/iu }), name);
      await user.type(screen.getByRole("textbox", { name: /alias/iu }), name);
      await user.clear(screen.getByRole("spinbutton", { name: /monto/iu }));
      await user.type(screen.getByRole("spinbutton", { name: /monto/iu }), amount);
      await user.click(screen.getByRole("button", { name: /submit/iu }));
    };
    const cashOut = async (player: string, amount: string) => {
      await user.click(
        within(screen.getByTestId(`seat-${player}`)).getByRole("button", { name: /cashout/iu }),
      );
      await user.clear(screen.getByRole("spinbutton", { name: /monto/iu }));
      await user.type(screen.getByRole("spinbutton", { name: /monto/iu }), amount);
      await user.click(screen.getByRole("button", { name: /submit/iu }));
    };

    await addPlayer("Ana", "100");
    await addPlayer("Beto", "100");
    await cashOut("Ana", "300");
    await cashOut("Beto", "0");

    expect(screen.getByTestId("total-balance")).toHaveTextContent("-$ 100");
    expect(screen.queryByText(/deudas/iu)).not.toBeInTheDocument();

    const anaCashOut = screen.getByText(/ana se fué con \$ 300/iu).closest("li");

    if (!anaCashOut) throw new Error("No cash out movement found");

    await user.click(within(anaCashOut).getByRole("button", { name: /edit movement/iu }));
    await user.clear(screen.getByRole("spinbutton", { name: /monto/iu }));
    await user.type(screen.getByRole("spinbutton", { name: /monto/iu }), "200");
    await user.click(screen.getByRole("button", { name: /submit/iu }));

    expect(screen.getByTestId("total-balance")).toHaveTextContent("$ 0");
    expect(screen.getByText(/deudas/iu)).toBeInTheDocument();
    expect(screen.getByText(/beto le debe \$ 100 a ana/iu)).toBeInTheDocument();
  });

  it("Shows the error thrown on submit and lets the form be submitted again", async () => {
    render(<HomePage />);
    const user = userEvent.setup();
    const openAddPlayer = async () => {
      const addPlayerButton = (await screen.findAllByRole("button", { name: /player/iu }))[0];

      if (!addPlayerButton) throw new Error("No add player button found");

      await user.click(addPlayerButton);
    };
    const fillAndSubmit = async (name: string) => {
      await user.clear(screen.getByRole("textbox", { name: /nombre/iu }));
      await user.type(screen.getByRole("textbox", { name: /nombre/iu }), name);
      await user.clear(screen.getByRole("textbox", { name: /alias/iu }));
      await user.type(screen.getByRole("textbox", { name: /alias/iu }), name);
      await user.clear(screen.getByRole("spinbutton", { name: /monto/iu }));
      await user.type(screen.getByRole("spinbutton", { name: /monto/iu }), "100");
      await user.click(screen.getByRole("button", { name: /submit/iu }));
    };

    await openAddPlayer();
    await fillAndSubmit("Ana");
    await openAddPlayer();
    await fillAndSubmit("Ana");

    expect(await screen.findByText(Table.playerAlreadyInGameError)).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await openAddPlayer();

    expect(screen.queryByText(Table.playerAlreadyInGameError)).not.toBeInTheDocument();

    await fillAndSubmit("Ana");

    expect(await screen.findByText(Table.playerAlreadyInGameError)).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: /nombre/iu }), "s");

    expect(screen.queryByText(Table.playerAlreadyInGameError)).not.toBeInTheDocument();

    await fillAndSubmit("Beto");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("seat-Beto")).toBeInTheDocument();
  });

  it("Shows validation errors in spanish", async () => {
    render(<HomePage />);
    const user = userEvent.setup();
    const addPlayerButton = (await screen.findAllByRole("button", { name: /player/iu }))[0];

    if (!addPlayerButton) throw new Error("No add player button found");

    await user.click(addPlayerButton);
    await user.clear(screen.getByRole("spinbutton", { name: /monto/iu }));
    await user.click(screen.getByRole("button", { name: /submit/iu }));

    expect(await screen.findByText("Ingresá un nombre")).toBeInTheDocument();
    expect(screen.getByText("Ingresá un alias")).toBeInTheDocument();
    expect(screen.getByText("Ingresá un monto")).toBeInTheDocument();
  });
});
