import { CardStack, Player, Direction } from './mod.ts';
export class Game {
	public static readonly MAX_PLAYERS = 5;
	public readonly HandSize: number;
	public Stack: CardStack;
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
		let slotsBuilder: CardStack[] = [];
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

	public play(): void {
		for (const player of this.players) {
			player.play(this);
		}
	}
}
