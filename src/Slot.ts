import { Card, Stack, IllegalStackOperationError, CardMatchError } from './mod.ts';

export class Slot extends Stack<Card> {
	/**
	 * Dictates the order of the cards
	*/
	readonly direction: Direction;

	constructor(items: Card[] = [], Direction: Direction) {
		super(items);
		this.direction = Direction;
	}

	match(item: Card) {
		const top = this.peek()?.value;
		if (top === undefined) {
			return; // If the Slot is empty, any card can be placed
		}
		/** Prerequirement */
		const inBounds = this.direction === Direction.Up ? top < Card.MAX_VALUE : top > Card.MIN_VALUE
		/** Common legal move */
		const rightDirection = this.direction === Direction.Up ? (item.value > top) : (item.value < top);
		/** Special rule */
		const jump = item.value === top + Number(this.direction) * 10 // up = 1, down = -1
		if (inBounds && (rightDirection || jump)) {
			return;
		} else {
			throw new CardMatchError(item, this);
		}
	}

	override push(item: Card): number {
		this.match(item); // Continue if card matches
		return super.push(item);
	}

	override pop(): Card {
		throw new IllegalStackOperationError('pop');
	}
}

export enum Direction {
	Down = -1,
	Up = 1
}