import { MicroModule } from "@uprtcl/micro-orchestrator";
import { GraphQlSchemaModule } from "@uprtcl/graphql";
import { createHolochainProvider } from "@uprtcl/holochain-provider";
import { gameSchema } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { ChessBindings } from "./bindings";
import { ChessGameList } from './elements/hc-chess-game-list';
import { ChessMyGames } from './elements/hc-chess-my-games';
import { ProfilesModule } from 'holochain-profiles/dist/hc-profiles.es5';
import { ChessGame } from './elements/hc-chess-game';

export class ChessModule extends MicroModule {
  dependencies = [ProfilesModule.id];

  constructor(instance) {
    super();

    this.instance = instance;
  }

  async onLoad(container) {
    const chessProvider = createHolochainProvider(this.instance, "chess");

    container.bind(ChessBindings.ChessProvider).to(chessProvider);

    customElements.define('hc-chess-game-list', ChessGameList);
    customElements.define('hc-chess-my-games', ChessMyGames);
    customElements.define('hc-chess-game', ChessGame);
  }

  get submodules() {
    return [new GraphQlSchemaModule(gameSchema, resolvers)];
  }
}
