import { Card, CardMatchError, Slot, Game } from "../mod.ts";
export abstract class Player {
	protected hand: Card[];

	constructor() {
		this.hand = [];
	}

	play(game: Game): Promise<void> {
		while (this.hand.length < game.handSize) {
			try {
				this.hand.push(game.drawPile.pop() as Card);
			} catch (_) {
				break;
			}
		}
		this.hand.sort((a, b) => a.value - b.value);

		return new Promise((resolve) => {
			resolve();
		});
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
				} catch (e) {
					if (e instanceof CardMatchError) {
						return false;
					}
					throw e;
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