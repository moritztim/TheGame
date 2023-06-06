import { CardStack, Player, Direction } from './mod.ts';

/**
 * The Game
 */
export class Game {
	/** Maximum player count */
	public static readonly MAX_PLAYERS = 5;
	/** Cards each player starts each round with (if there's enough cards in the @see Stack) */
	public readonly HandSize: number;
	/** Stack of cards to draw from */
	public Stack: CardStack;
	/** Slots to play cards on */
	public Slots: [CardStack, CardStack, CardStack, CardStack];
	private players: Player[];

	constructor(players: Player[]) {
		if (players.length > Game.MAX_PLAYERS) { throw new Error(`Player limit (${Game.MAX_PLAYERS}) exceeded`); }
		this.players = players;
		switch (players.length) {
			case 1:
				this.HandSize = 8;
				break;
			case 2:
				this.HandSize = 7;
				break;
			default:
				this.HandSize = 6;
		}
		this.Stack = new CardStack();
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
