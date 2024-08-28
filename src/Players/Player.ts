import { Card, CardMatchError, Slot, Game, EmptyStackError } from "../mod.ts";
import { Action, Turn } from "../Turn.ts";

export class CanNotPlayError extends Error {
	constructor() {
		super("Can not play");
	}
}

export abstract class Player {
	protected hand: Card[];
	@sealed get handSize() {
		return this.hand.length;
	}
	active: boolean = false;

	constructor() {
		this.hand = [];
	}

	/**
	 * Play a card
	 * @param game The game to play in
	 * @throws {CanNotPlayError} If the player can not put any cards on the board
	 * @returns A promise that resolves when the turn is done
	 */
	abstract play(game: Game): Promise<Action>

	@sealed say(players: Player[], message: string) {
		players.forEach((player) => player.hear(message));
	}

	abstract hear(message: string): void

	@sealed draw(cards: number, game: Game) {
		for (let i = 0; i < cards; i++) {
			try {
				this.hand.push(game.drawPile.pop());
			} catch (error) {
				if (error instanceof EmptyStackError) break
				throw error
			}
		}
		this.active = this.hand.length > 0;
	}

	@sealed protected matches(slot: Slot): Card[] {
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

	@sealed protected pushableSlots(game: Game): Slot[] {
		return game.slots.filter((slot) => this.matches(slot).length > 0);
	}
	@sealed protected playableCards(game: Game, pushableSlots?: Slot[]): Card[] {
		pushableSlots ??= this.pushableSlots(game);
		return pushableSlots.flatMap((slot) => this.matches(slot));
	}
}

// deno-lint-ignore ban-types
function sealed<T extends Function>(
	_target: T,
	context: ClassMethodDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext
): T | void {
	context.addInitializer(function () {
		Object.defineProperty(this, context.name, {
			configurable: false,
			writable: false
		});
	});
}
