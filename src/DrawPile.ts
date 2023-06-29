import { Card, Stack, IllegalStackOperationError } from './mod.ts';

/**
 * Deck of cards to draw from
 */
export class DrawPile extends Stack<Card> {

	/**
	 * @param items Cards to fill the Draw Pile with (note that this is only to be used for testing)
	 */
	constructor(items: Card[] = []) { // TODO: Limit custom items to testing
		super(items);
		// Fill the Draw Pile with cards
		if (this.items.length === 0) {
			for (let i = Card.MIN_VALUE; i <= Card.MAX_VALUE; i++) {
				this.items.push(new Card(i));
			} // fill it with cards
			this.items.sort(() => Math.random() - 0.5); // shuffle the cards
		}
	}

	public override push(_item: Card): number {
		throw new IllegalStackOperationError('push');
	}

	public override peek(): Card {
		throw new IllegalStackOperationError('peek');
	}
}