import { Card, Stack, IllegalStackOperationError, CardMatchError } from './mod.ts';

/**
 * Stack of Cards
 */
export class CardStack extends Stack<Card> {
	/**
	 * Direction to dictate the order of the cards
	 * Not applicable for Slot (therefore this can be used to tell a Draw Pile from a Slot)
	*/
	public readonly Direction?: Direction;

	constructor(items: Card[] = [], Direction?: Direction) {
		super(items);
		this.Direction = Direction;
		if (!this.IsSlot && this.items.length === 0) { // If it's not a slot and it's empty
			for (let i = Card.MIN_VALUE; i <= Card.MAX_VALUE; i++) {
				this.items.push(new Card(i));
			} // fill it with cards
			this.items.sort(() => Math.random() - 0.5);
		} // otherwise leave it empty, as the players will place cards.
	}

	/** Is this a Slot? */
	public get IsSlot(): boolean {
		return !this.IsDrawPile
	}

	/** Is this a Draw Pile? */
	public get IsDrawPile(): boolean {
		return this.Direction == undefined;
	}

	public match(item: Card) {
		if (!this.isSlot) { throw new IllegalStackOperationError('match'); } // No peeking, no matching
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
		if (!this.isSlot) {
			throw new IllegalStackOperationError('push'); // Can't push onto the Draw Pile
		}
		this.match(item); // Continue if card matches
		return super.push(item);
	}

	public override pop(): Card {
		if (this.IsSlot) {
			throw new IllegalStackOperationError('pop'); // Can't steal from a slot
		}
		return super.pop();
	}

	public override peek(): Card {
		if (!this.isSlot) {
			throw new IllegalStackOperationError('peek'); // Can't peak the Draw Pile
		}
		return super.peek();
	}
}

export enum Direction {
	Down = -1,
	Up = 1
}