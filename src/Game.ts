import { Card } from './Card.ts';
import { DrawPile, Player, Direction, Slot, CanNotPlayError } from './mod.ts';

/**
 * Represents the result of a game
 */
type Result = {
	/** Total cards - cards still in hand(s) */
	score: number;
	/** Whether the result is "excellent" */
	excellent: boolean;
	/** If all 98 cards were played, you beat the game. */
	beat: boolean;
};

/**
 * The Game
 */
export class Game {
	// Constant Rules
	// NOLI SE TANGERE
	/** Maximum player count */
	static readonly MAX_PLAYERS = 5;
	/** Minimum score to achieve a "excellent" game */
	static readonly EXCELLENT_THRESHOLD = 90;

	/** Cards each player starts each round with (if there's enough cards in the @see Stack) */
	readonly handSize: number;
	/** Stack to draw from */
	drawPile: DrawPile;
	/** Slots to play cards on */
	slots: [Slot, Slot, Slot, Slot];
	#players: Player[];

	constructor(players: Player[]) {
		if (players.length > Game.MAX_PLAYERS) { throw new Error(`Player limit (${Game.MAX_PLAYERS}) exceeded`); } // prevent overfill
		this.#players = players;
		this.handSize = 9 - Math.max(players.length, 3); // 8, 7, 6

		this.drawPile = new DrawPile();

		const slotsBuilder: Slot[] = [];
		for (const keyString in Direction) { // for each key in the enum Direction
			// A little hack to get the actual keys
			const key = Number(keyString);
			if (isNaN(key)) { continue; }

			let i = 2;
			while (i--) { // while i < 0
				slotsBuilder.push(new Slot([], key));
			}
		}
		this.slots = slotsBuilder as [Slot, Slot, Slot, Slot];
	}

	get players(): Player[] {
		return this.#players;
	}

	get result(): Result {
		const score = Card.COUNT - this.#players.reduce((acc, player) => acc + player.handSize, 0);
		return {
			score: score,
			excellent: score > Game.EXCELLENT_THRESHOLD,
			beat: score != 0
		}
	}


	/** Play an entire game */
	async play(): Promise<Result> {
		while (true) {
			try {
				for (const player of this.#players) {
					await player.play(this);
				}
			} catch (error) {
				if (error instanceof CanNotPlayError) break;
				else throw error;
			}
		}
		return this.result;
	}
}