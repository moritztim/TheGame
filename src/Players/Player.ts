import { Card, CardMatchError, Slot, Game, EmptyStackError } from "../mod.ts";

export class CanNotPlayError extends Error {
	constructor() {
		super("Can not play");
	}
}

export abstract class Player {
	protected hand: Card[];
	get handSize() {
		return this.hand.length;
	}

	constructor() {
		this.hand = [];
	}

	/**
	 * Play a turn in the {@link game}
	 * @param game The game to play in
	 * @throws {CanNotPlayError} If the player can not put any cards on the board
	 * @returns A promise that resolves when the turn is done
	 */
	play(game: Game): Promise<void> {
		this.draw(game.handSize - this.handSize, game);
		return new Promise((resolve) => {
			resolve();
		});
	}

	protected draw(cards: number, game: Game) {
		for (let i = 0; i < cards; i++) {
			try {
				this.hand.push(game.drawPile.pop());
			} catch (error) {
				if (error instanceof EmptyStackError) break
				throw error
			}
		}
	}

	protected matches(slot: Slot): Card[] {
		const top = slot.peek();
		if (top == null) {
			return this.hand;
		}
		return this.hand.filter(
			(card) => {
				try {
					slot.match(card);
					return true;
				} catch (error) {
					if (error instanceof CardMatchError) {
						return false;
					}
					throw error;
				}
			}
		);
	}

	protected pushableSlots(game: Game): Slot[] {
		return game.slots.filter((slot) => this.matches(slot).length > 0);
	}
	protected playableCards(game: Game, pushableSlots?: Slot[]): Card[] {
		pushableSlots ??= this.pushableSlots(game);
		return pushableSlots.flatMap((slot) => this.matches(slot));
	}
}