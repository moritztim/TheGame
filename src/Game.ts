import { DrawPile, Player, Direction, Slot } from './mod.ts';

/**
 * The Game
 */
export class Game {
	// Constant Rules
	// NOLI SE TANGERE
	/** Maximum player count */
	static readonly MAX_PLAYERS = 5;
	/** Hand sizes mapped to player counts */
	static readonly HAND_SIZES = new Map([
		[1, 8],
		[2, 7],
		[3, 6] // 3 and above are the same
	]);

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
		this.handSize = Game.HAND_SIZES.get(players.length) || Game.HAND_SIZES.get(Game.HAND_SIZES.size) as number // get the hand size for the player count (or the last one if it doesn't exist)

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

	/** Play an entire game */
	play(): void {
		for (const player of this.#players) {
			player.play(this);
		}
	}
}
