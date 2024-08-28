import { Card, CardMatchError, Slot, Game, EmptyStackError } from "../mod.ts";
import { Action } from "../Turn.ts";

export class CanNotPlayError extends Error {
	constructor() {
		super("Can not play");
	}
}

export class IllegalMessageError extends Error {
	constructor() {
		super("Relating concrete numbers in any way is strictly forbidden."); // quote from the rules
	}
}

type MessageSegment = string | Slot;
type SlotRating = {
	severity?: number
	smallMove?: boolean
};

type SlotRatings = [SlotRating, SlotRating, SlotRating, SlotRating];

class Message {
	constructor(segments: MessageSegment[]);
	constructor(slotRatings: SlotRatings);
	constructor(public content: MessageSegment[] | SlotRatings) {
		if (!(content.length && content[0] instanceof Slot)) {
			if (content.some((segment) => typeof segment === "string" && !Number.isNaN(parseInt(segment)))) {
				throw new IllegalMessageError();
			}
		}
	}
}

export abstract class Player {
	protected readonly hand: Card[] = [];
	@sealed get handSize() {
		return this.hand.length;
	}
	active: boolean = false;

	/**
	 * Play a card
	 * @param game The game to play in
	 * @throws {CanNotPlayError} If the player can not put any cards on the board
	 * @returns A promise that resolves when the turn is done
	 */
	abstract play(game: Game): Promise<Action>

	@sealed say(players: Player[], message: Message) {
		players.forEach((player) => player.hear(message));
	}

	abstract hear(message: Message): void

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
