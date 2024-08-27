import { Card, CardMatchError, Slot, Game, EmptyStackError } from "../mod.ts";
export abstract class Player {
	protected hand: Card[];

	constructor() {
		this.hand = [];
	}

	play(game: Game): Promise<void> {
		this.draw(this.hand.length - game.handSize, game)
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