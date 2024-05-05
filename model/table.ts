type Player = string;
type MovementType = "BuyIn" | "ReBuy" | "CashOut";
type Movement = {
  player: Player;
  type: MovementType;
  amount: number;
};

// TODO: guardar en sessionStorage o localStorage
// TODO: persistir en un DB
// TODO: registrar usuarios, tenant x mesa/usuario ?
// TODO: reportes: tap10 de ganadores (en AR$ y en U$D), top10 de perdedores ?

const byAmount = (a: { amount: number }, b: { amount: number }) => b.amount - a.amount;

class Table {
  private readonly movements: Movement[] = [];
  private readonly aliases: Record<Player, string> = {};

  static playerAlreadyInGameError = "Jugador ya está en la mesa";
  static playerNotFoundError = "Jugador no encontrado";
  static amountMustBePositiveError = "El monto debe ser positivo";
  static balanceNotZeroError = "La suma de los balances no es cero: ";
  static movementNotFoundError = "Movimiento no encontrado";

  private playerIsInGame(player: Player) {
    const buyInQuantity = this.movements.filter(
      (m) => m.type === "BuyIn" && m.player === player,
    ).length;
    const cashOutQuantity = this.movements.filter(
      (m) => m.type === "CashOut" && m.player === player,
    ).length;

    return buyInQuantity > cashOutQuantity;
  }

  private assertPlayerIsInGame(player: string) {
    if (!this.playerIsInGame(player)) throw new Error(Table.playerNotFoundError);
  }

  private assertPlayerIsNotInGame(player: string) {
    if (this.playerIsInGame(player)) throw new Error(Table.playerAlreadyInGameError);
  }

  private assertAmountIsZeroOrPositive(amount: number) {
    if (amount < 0) throw new Error(Table.amountMustBePositiveError);
  }

  private assertAmountIsPositive(amount: number) {
    if (amount <= 0) throw new Error(Table.amountMustBePositiveError);
  }

  addPlayer(player: Player, alias: string, amount: number) {
    this.assertAmountIsPositive(amount);
    this.assertPlayerIsNotInGame(player);

    this.aliases[player] = alias;
    this.movements.push({ player, amount: -amount, type: "BuyIn" });
  }

  reBuy(player: Player, amount: number) {
    this.assertAmountIsPositive(amount);
    this.assertPlayerIsInGame(player);
    this.movements.push({ player, amount: -amount, type: "ReBuy" });
  }

  cashOut(player: Player, amount: number) {
    this.assertAmountIsZeroOrPositive(amount);
    this.assertPlayerIsInGame(player);
    this.movements.push({ player, amount, type: "CashOut" });
  }

  editMovement(movementIndex: number, player: Player, amount: number) {
    const currentMovement = this.movements[movementIndex];

    if (!currentMovement) throw new Error(Table.movementNotFoundError);

    this.movements[movementIndex] = {
      player,
      amount: currentMovement.amount < 0 ? -amount : amount,
      type: currentMovement.type,
    };
  }

  deleteMovement(movementIndex: number) {
    this.movements.splice(movementIndex, 1);
  }

  totalBalance() {
    return this.movements.reduce((acc, movement) => {
      return acc - movement.amount;
    }, 0);
  }

  players(): Record<Player, number> {
    return this.movements.reduce<Record<Player, number>>(
      (acc, m) => ({
        ...acc,
        [m.player]: (acc[m.player] ?? 0) + m.amount,
      }),
      {},
    );
  }

  getMovements() {
    const types: Record<MovementType, (movement: Movement) => string> = {
      BuyIn: (movement: Movement) => `${movement.player} entró con ${-movement.amount}`,
      ReBuy: (movement: Movement) => `${movement.player} recompró ${-movement.amount}`,
      CashOut: (movement: Movement) => `${movement.player} se fué con ${movement.amount}`,
    };

    return this.movements.map((movement) => types[movement.type](movement));
  }

  calculateTransfers() {
    const players = this.players();
    const totalBalance = Object.values(players).reduce((acc, val) => acc + val, 0);

    if (totalBalance !== 0) throw new Error(`${Table.balanceNotZeroError}${totalBalance}`);

    const creditors: Array<{ name: string; amount: number }> = [];
    const debtors: Array<{ name: string; amount: number }> = [];

    Object.entries(players).forEach(([name, amount]) => {
      if (amount > 0) {
        creditors.push({ name, amount });
      } else if (amount < 0) {
        debtors.push({ name, amount: -amount });
      }
    });

    creditors.sort(byAmount);
    debtors.sort(byAmount);

    const result = [];

    while (creditors.length > 0 && debtors.length > 0 && creditors[0] && debtors[0]) {
      const [creditor, debtor] = [creditors[0], debtors[0]];
      const settledAmount = Math.min(creditor.amount, debtor.amount);

      creditor.amount -= settledAmount;
      debtor.amount -= settledAmount;
      creditor.amount === 0 ? creditors.shift() : creditors.sort(byAmount);
      debtor.amount === 0 ? debtors.shift() : debtors.sort(byAmount);

      result.push(
        `${debtor.name} le debe ${settledAmount} a ${creditor.name} (${this.aliases[creditor.name]})`,
      );
    }

    return result;
  }
}

export default Table;
