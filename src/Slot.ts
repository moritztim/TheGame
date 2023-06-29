import { Card, Stack, IllegalStackOperationError, CardMatchError } from './mod.ts';

export class Slot extends Stack<Card> {
	/**
	 * Dictates the order of the cards
	*/
	public readonly Direction: Direction;

		constructor(items: Card[] = [], Direction: Direction) {
		super(items);
		this.Direction = Direction;
	}
	
	public match(item: Card) {
		const top = this.peek()?.Value;
		if (top === undefined) {
			return; // If the Slot is empty, any card can be placed
		}
		/** Prerequirement */
		const inBounds = this.Direction === Direction.Up ? top < Card.MAX_VALUE : top > Card.MIN_VALUE
		/** Common legal move */
		const rightDirection = this.Direction === Direction.Up ? (item.Value > top) : (item.Value < top);
		/** Special rule */
		const jump = item.Value === top + Number(this.Direction) * 10 // up = 1, down = -1
		if (inBounds && (rightDirection || jump)) {
			return;
		} else {
			throw new CardMatchError(item, this);
		}
	}
	
	public override push(item: Card): number {
		this.match(item); // Continue if card matches
		return super.push(item);
	}
	
	public override pop(): Card {
		throw new IllegalStackOperationError('pop');
	}
}

export enum Direction {
	Down = -1,
	Up = 1
}