import { ChessBindings } from "../bindings";

async function addressToGame(provider, address) {
  const game = await provider.call("get_entry", { entry_address: address });

  return {
    id: address,
    ...JSON.parse(game.App[1]),
  };
}

export const resolvers = {
  Query: {
    game(_, { gameId }, { container }) {
      const chessProvider = container.get(ChessBindings.ChessProvider);

      return addressToGame(chessProvider, gameId);
    },
  },
  Me: {
    async games(agent, _, { container }) {
      const chessProvider = container.get(ChessBindings.ChessProvider);

      const gameAddresses = await chessProvider.call("get_my_games", {});
      return Promise.all(
        gameAddresses.map((address) => addressToGame(chessProvider, address))
      );
    },
  },
  Game: {
    players(game) {
      return game.players.map((p) => ({ id: p }));
    },
    createdAt(game) {
      return game.created_at;
    },
    async state(game, _, { container }) {
      const chessProvider = container.get(ChessBindings.ChessProvider);

      return chessProvider.call("get_game_state", { game_address: game.id });
    },
    async moves(game, _, { container }) {
      const chessProvider = container.get(ChessBindings.ChessProvider);

      return chessProvider.call("get_game_moves", { game_address: game.id });
    },
    async winner(game, _, { container }) {
      let moves = game.moves;
      if (!moves) {
        const chessProvider = container.get(ChessBindings.ChessProvider);
        moves = await chessProvider.call("get_game_moves", {
          game_address: game.id,
        });
      }
    },
  },
  Mutation: {
    async makeMove(_, { gameId, from, to }, { container }) {
      const chessProvider = container.get(ChessBindings.ChessProvider);

      return chessProvider.call("make_move", {
        game_address: gameId,
        from,
        to,
      });
    },
  },
};
