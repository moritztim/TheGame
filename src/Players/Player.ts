import { Card, CardMatchError, CardStack, Game } from "../mod.ts";
export abstract class Player {
	protected hand: Card[];

	constructor() {
		this.hand = [];
	}

	public play(game: Game): Promise<void> {
		while (this.hand.length < game.HandSize) {
			try {
				this.hand.push(game.DrawPile.pop() as Card);
			} catch (_) {
				break;
			}
		}
		this.hand.sort((a, b) => a.Value - b.Value);

		return new Promise((resolve) => {
			resolve();
		});
	}
	protected matches(slot: CardStack): Card[] {
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

	protected pushableSlots(game: Game): CardStack[] {
		return game.Slots.filter((slot) => this.matches(slot).length > 0);
	}
	protected playableCards(game: Game, pushableSlots?: CardStack[]): Card[] {
		pushableSlots ??= this.pushableSlots(game);
		return pushableSlots.flatMap((slot) => this.matches(slot));
	}
}