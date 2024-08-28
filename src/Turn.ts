import { Card } from "./Card.ts";
import { Game } from "./Game.ts";
import { CanNotPlayError } from "./Players/Player.ts";
import { Player } from "./mod.ts";


export class DoubleExecutionError extends Error {
	constructor() {
		super("Double execution of action");
	}
}

export class Action {
	executed: boolean = false;
	constructor(
		public readonly stackIndex: number,
		public readonly card: Card,
		private readonly game: Game
	) {
		if (stackIndex < 0 || stackIndex >= game.slots.length) {
			throw new Error("Invalid stack index");
		}
		game.slots[stackIndex].match(card)
	}

	execute() {
		if (this.executed) {
			throw new DoubleExecutionError();
		}
		this.game.slots[this.stackIndex].push(this.card);
		this.executed = true;
	}
}

export class Turn {
	static readonly CARDS_TO_PLAY = 2;
	private cardsPlayed: number = 0;

	constructor(
		private game: Game,
		private player: Player
	) {
	}

	private get cardsToPlay() {
		return this.game.drawPile.length === 0 ? 1 : (Turn.CARDS_TO_PLAY + Number(this.game.difficulty.increaseCardRequirement));
	}

	play() {
		const { game, player, cardsPlayed, cardsToPlay } = this;

		player.draw(game.handSize - player.handSize, game);
		while (cardsPlayed < cardsToPlay && player.handSize && player.active) {
			player.play(game).then((action) => {
				action.execute();
				this.cardsPlayed++;
			});
		}
	}
}