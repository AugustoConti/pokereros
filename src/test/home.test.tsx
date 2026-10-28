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
import { setWideScreen } from "@/test/screen";

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

async function renderHome() {
  render(<HomePage />);
  await screen.findByRole("heading", { level: 1, name: "Pokereros" });

  return userEvent.setup();
}

type User = Awaited<ReturnType<typeof renderHome>>;

async function typeAmount(user: User, label: RegExp, amount: string) {
  const input = screen.getByRole("textbox", { name: label });

  await user.clear(input);
  await user.type(input, amount);
}

async function fillPlayer(user: User, name: string, amount: string) {
  await user.clear(screen.getByRole("textbox", { name: /nombre/iu }));
  await user.type(screen.getByRole("textbox", { name: /nombre/iu }), name);
  await user.clear(screen.getByRole("textbox", { name: /alias/iu }));
  await user.type(screen.getByRole("textbox", { name: /alias/iu }), name.toLowerCase());
  await typeAmount(user, /con cuánto entra/iu, amount);
  await user.click(screen.getByRole("button", { name: "Sumar a la mesa" }));
}

async function addPlayer(user: User, name: string, amount: string) {
  await user.click(screen.getByRole("button", { name: "Sumar jugador" }));
  await fillPlayer(user, name, amount);
}

async function cashOut(user: User, name: string, amount: string) {
  await user.click(screen.getByRole("button", { name: `${name} se va` }));
  await typeAmount(user, /con cuánto se va/iu, amount);
  await user.click(screen.getByRole("button", { name: "Confirmar salida" }));
}

describe("Poker", () => {
  it("Starts with an empty table and nothing in the pot", async () => {
    await renderHome();

    expect(screen.getByTestId("total-balance")).toHaveTextContent("$ 0");
    expect(screen.getByText(/todavía no hay nadie en la mesa/iu)).toBeInTheDocument();
  });

  it("Adds a player to the table", async () => {
    const user = await renderHome();

    await addPlayer(user, "Player 1", "100");

    expect(screen.getByTestId("seat-Player 1")).toHaveTextContent("Player 1");
    expect(screen.getByTestId("player-Player 1")).toHaveTextContent("-$ 100");
    expect(screen.getByTestId("player-Player 1")).toHaveTextContent("En juego");
    expect(screen.getByTestId("total-balance")).toHaveTextContent("$ 100");

    await user.click(screen.getByRole("tab", { name: "Movimientos" }));

    expect(screen.getByText(/player 1 entró con \$ 100/iu)).toBeInTheDocument();
  });

  it("Adds up the chip shortcuts", async () => {
    const user = await renderHome();

    await user.click(screen.getByRole("button", { name: "Sumar jugador" }));

    const amount = screen.getByRole("textbox", { name: /con cuánto entra/iu });
    const addTenThousand = screen.getByRole("button", { name: /^sumar \$\s10\.000$/iu });

    expect(amount).toHaveValue("");

    await user.click(addTenThousand);
    await user.click(addTenThousand);
    await user.click(addTenThousand);
    await user.click(screen.getByRole("button", { name: /^sumar \$\s5\.000$/iu }));

    expect(amount).toHaveValue("35.000");

    await user.click(screen.getByRole("button", { name: "Borrar monto" }));

    expect(amount).toHaveValue("");
  });

  it("Leaves with nothing when the amount is empty", async () => {
    const user = await renderHome();

    await addPlayer(user, "Ana", "100");
    await user.click(screen.getByRole("button", { name: "Ana se va" }));

    expect(screen.getByRole("textbox", { name: /con cuánto se va/iu })).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "Confirmar salida" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("player-Ana")).toHaveTextContent("Se fue");
    expect(screen.getByTestId("player-Ana")).toHaveTextContent("-$ 100");
  });

  it("Leaves with everything that's left in the pot", async () => {
    const user = await renderHome();

    await addPlayer(user, "Ana", "100");
    await addPlayer(user, "Beto", "50");
    await user.click(screen.getByRole("button", { name: "Ana se va" }));
    await user.click(screen.getByRole("button", { name: /^sumar \$\s5\.000$/iu }));
    await user.click(screen.getByRole("button", { name: /^todo lo que queda: \$\s150$/iu }));

    expect(screen.getByRole("textbox", { name: /con cuánto se va/iu })).toHaveValue("150");

    await user.click(screen.getByRole("button", { name: "Confirmar salida" }));

    expect(screen.getByTestId("total-balance")).toHaveTextContent("$ 0");
  });

  it("Corrects a movement by adding chips to its amount", async () => {
    const user = await renderHome();

    await addPlayer(user, "Ana", "10000");
    await user.click(screen.getByRole("tab", { name: "Movimientos" }));
    await user.click(
      screen.getByRole("button", { name: /^corregir: ana entró con \$\s10\.000$/iu }),
    );
    await user.click(screen.getByRole("button", { name: /^sumar \$\s20\.000$/iu }));

    expect(screen.getByRole("textbox", { name: /monto correcto/iu })).toHaveValue("30.000");

    await user.click(screen.getByRole("button", { name: "Guardar cambio" }));

    expect(screen.getByText(/ana entró con \$ 30\.000/iu)).toBeInTheDocument();
  });

  it("Allows cashing out more than the pot and only shows debts once it's back to zero", async () => {
    const user = await renderHome();

    await addPlayer(user, "Ana", "100");
    await addPlayer(user, "Beto", "100");
    await cashOut(user, "Ana", "300");
    await cashOut(user, "Beto", "0");

    expect(screen.getByTestId("total-balance")).toHaveTextContent("-$ 100");

    await user.click(screen.getByRole("tab", { name: "Cierre" }));

    expect(screen.getByText(/se anotaron/iu)).toHaveTextContent("Se anotaron $ 100 más");
    expect(screen.queryByText("La mesa cerró")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Movimientos" }));
    await user.click(screen.getByRole("button", { name: /^corregir: ana se fué con \$\s300$/iu }));
    await typeAmount(user, /monto correcto/iu, "200");
    await user.click(screen.getByRole("button", { name: "Guardar cambio" }));
    await user.click(screen.getByRole("tab", { name: "Cierre" }));

    expect(screen.getByTestId("total-balance")).toHaveTextContent("$ 0");
    expect(screen.getByText("La mesa cerró")).toBeInTheDocument();

    const payment = screen.getByText("Beto le paga a Ana").closest("li");

    if (!payment) throw new Error("No payment found");

    expect(payment).toHaveTextContent("$ 100");

    await user.click(within(payment).getByRole("button", { name: "Marcar pagado" }));

    expect(within(payment).getByRole("button", { name: "Pagado" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Copiar deudas" }));

    expect(await navigator.clipboard.readText()).toBe("Beto le debe $\u00a0100 a Ana (ana)");
  });

  it("Lets a player who left buy in again", async () => {
    const user = await renderHome();

    await addPlayer(user, "Ana", "100");
    await cashOut(user, "Ana", "50");

    expect(screen.getByTestId("player-Ana")).toHaveTextContent("Se fue");
    expect(screen.queryByTestId("seat-Ana")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ana vuelve a entrar" }));
    await typeAmount(user, /con cuánto entra/iu, "100");
    await user.click(screen.getByRole("button", { name: "Confirmar entrada" }));

    expect(screen.getByTestId("player-Ana")).toHaveTextContent("En juego");
    expect(screen.getByTestId("player-Ana")).toHaveTextContent("-$ 150");
  });

  it("Shows the error thrown on submit and lets the form be submitted again", async () => {
    const user = await renderHome();

    await addPlayer(user, "Ana", "100");
    await addPlayer(user, "Ana", "100");

    expect(await screen.findByText(Table.playerAlreadyInGameError)).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: /nombre/iu }), "s");

    expect(screen.queryByText(Table.playerAlreadyInGameError)).not.toBeInTheDocument();

    await fillPlayer(user, "Beto", "100");

    expect(screen.getByTestId("seat-Beto")).toBeInTheDocument();
  });

  it("Shows validation errors in Spanish", async () => {
    const user = await renderHome();

    await user.click(screen.getByRole("button", { name: "Sumar jugador" }));
    await user.clear(screen.getByRole("textbox", { name: /con cuánto entra/iu }));
    await user.click(screen.getByRole("button", { name: "Sumar a la mesa" }));

    expect(await screen.findByText("Ingresá un nombre")).toBeInTheDocument();
    expect(screen.getByText("Ingresá un alias")).toBeInTheDocument();
    expect(screen.getByText("Ingresá un monto")).toBeInTheDocument();
  });
});

describe("Poker on a wide screen", () => {
  it("Shows the players and the movements side by side", async () => {
    setWideScreen(true);
    const user = await renderHome();

    expect(screen.getByRole("heading", { name: "Jugadores" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Movimientos",
      "Cierre",
    ]);

    await addPlayer(user, "Ana", "100");

    expect(screen.getByTestId("seat-Ana")).toHaveTextContent("-$ 100");
    expect(screen.getByTestId("player-Ana")).toHaveTextContent("En juego");
    expect(screen.getByText(/ana entró con \$ 100/iu)).toBeInTheDocument();
  });
});
