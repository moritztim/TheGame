import { CardStack, Player, Direction } from './mod.ts';

/**
 * The Game
 */
export class Game {
	// Constant Rules
	// NOLI SE TANGERE
	/** Maximum player count */
	public static readonly MAX_PLAYERS = 5;
	/** Hand sizes mapped to player counts */
	public static readonly HAND_SIZES = new Map([
		[1, 8],
		[2, 7],
		[3, 6] // 3 and above are the same
	]);

	/** Cards each player starts each round with (if there's enough cards in the @see Stack) */
	public readonly HandSize: number;
	/** Stack to draw from */
	public DrawPile: CardStack;
	/** Slots to play cards on */
	public Slots: [CardStack, CardStack, CardStack, CardStack];
	private players: Player[];

	constructor(players: Player[]) {
		if (players.length > Game.MAX_PLAYERS) { throw new Error(`Player limit (${Game.MAX_PLAYERS}) exceeded`); } // prevent overfill
		this.players = players;
		this.HandSize = Game.HAND_SIZES.get(players.length) || Game.HAND_SIZES.get(Game.HAND_SIZES.size) as number // get the hand size for the player count (or the last one if it doesn't exist)

		this.DrawPile = new CardStack();
		const slotsBuilder: CardStack[] = [];
		for (const keyString in Direction) {
			const key = Number(keyString);
			if (isNaN(key)) { continue; }
			let i = 2;
			while (i--) {
				slotsBuilder.push(new CardStack([], key));
			}
		}

		this.Slots = slotsBuilder as [CardStack, CardStack, CardStack, CardStack];
	}

	public get Players(): Player[] {
		return this.players;
	}

	/** Play an entire game */
	public play(): void {
		for (const player of this.players) {
			player.play(this);
		}
	}
}
