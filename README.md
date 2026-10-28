# ♠️ Pokereros

Gestioná las entradas, recompras y salidas de tus partidas de póker con amigos, y dejá que la app calcule quién le debe cuánto a quién.

**[pokereros.vercel.app](https://pokereros.vercel.app)**

## Qué hace

- **Mesa en vivo**: anotá cuando alguien entra, recompra o se va, y mirá el balance de cada jugador.
- **Deudas simplificadas**: cuando el pozo queda en cero, calcula quién le paga a quién para saldar todo, empezando por el que más perdió con el que más ganó. Mientras los números no cierren, no muestra deudas, así podés corregir movimientos hasta que cuadren.
- **Compartir la mesa**: mandá el link o mostrá el QR para que los demás sigan la partida en modo solo lectura.
- **Contador de fichas**: configurá valores y colores, contá fichas y mirá el total en plata y en ciegas grandes.
- **Ranking de manos**: una referencia rápida de qué mano le gana a cuál.

## Cómo se guardan los datos

- La mesa vive en el navegador (`localStorage`) y se sincroniza con Redis para poder compartirla.
- **Cualquiera con el link puede ver la mesa**, pero solo puede modificarla el navegador que la creó. Ese navegador recibe una cookie `httpOnly`, y en Redis se guarda solo un hash de ella.
- Lo único que se guarda son los nombres, alias y montos que cargues. Las mesas se borran solas después de 30 días sin uso.

## Stack

[TanStack Start](https://tanstack.com/start) (modo SPA, con [Nitro](https://nitro.build)) · React 19 · [TanStack Form](https://tanstack.com/form) · [zod](https://zod.dev) · [Tailwind CSS 4](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) · Redis ([ioredis](https://github.com/redis/ioredis)) · [Vitest](https://vitest.dev) · deploy en [Vercel](https://vercel.com).

## Desarrollo

Necesitás **Node 24**, **pnpm 10+** y un **Redis** accesible.

```bash
git clone https://github.com/AugustoConti/pokereros.git
cd pokereros
pnpm install
cp .env.example .env.local   # define REDIS_URL
```

Levantá un Redis local con lo que tengas a mano:

```bash
docker run --rm -p 6379:6379 redis   # con Docker
brew services start redis            # o con Homebrew
```

Y arrancá la app en [localhost:3000](http://localhost:3000):

```bash
pnpm dev
```

### Scripts

| Script               | Qué hace                                                     |
| -------------------- | ------------------------------------------------------------ |
| `pnpm dev`           | Servidor de desarrollo                                       |
| `pnpm build`         | Build de producción en `.output/`                            |
| `pnpm start`         | Sirve el build con Node                                      |
| `pnpm test`          | Tests en modo watch (`pnpm test:run` para correrlos una vez) |
| `pnpm test:coverage` | Tests con cobertura                                          |
| `pnpm lint`          | ESLint (`pnpm lint:fix` para corregir)                       |
| `pnpm format`        | Prettier                                                     |
| `pnpm type:check`    | TypeScript                                                   |
| `pnpm validate`      | Formatea, corrige lint, chequea tipos y corre los tests      |

### Estructura

```
src/
├── routes/        # Páginas (file-based routing de TanStack Router)
├── components/    # Componentes de la mesa y formularios
│   └── ui/        # Componentes de shadcn/ui y el form de TanStack Form
├── models/        # Lógica de la mesa (sin dependencias de React), con sus tests
├── server/        # Server functions: guardar/leer mesas, dueño y rate limit
├── db/            # Cliente de Redis
└── test/          # Setup y tests de UI
```

La lógica del juego está en `src/models/table.ts`: si querés cambiar cómo se calculan balances o deudas, empezá por ahí y por `table.test.ts`.

## Deploy

El proyecto está pensado para Vercel. `vercel.json` define el framework (`tanstack-start`) y las rewrites del modo SPA: todo se sirve desde `/_shell.html`, salvo los assets y las server functions (`/_serverFn/*`).

Solo hace falta la variable de entorno `REDIS_URL`. En Vercel la podés obtener conectando una base Redis desde el [Marketplace](https://vercel.com/marketplace?category=storage).

## Seguridad

Si encontrás una vulnerabilidad, por favor **no abras un issue público**: reportala de forma privada desde [Security → Report a vulnerability](https://github.com/AugustoConti/pokereros/security/advisories/new).

## Contribuir

¡Los issues y PRs son bienvenidos! Antes de abrir un PR, corré `pnpm validate` para chequear format, lint, tipos y tests.

## Licencia

[MIT](LICENSE) © Augusto Conti.
