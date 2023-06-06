import { Card, Stack, IllegalStackOperationError, CardMatchError } from './mod.ts';

export class CardStack extends Stack<Card> {
	public readonly Direction?: Direction;

	constructor(items: Card[] = [], Direction?: Direction) {
		if (Direction === undefined && items.length === 0) {
			for (let i = Card.MIN_VALUE; i <= Card.MAX_VALUE; i++) {
				items.push(new Card(i));
			}
			items.sort(() => Math.random() - 0.5);
		}
		super(items);
		this.Direction = Direction;
	}

	public match(item: Card) {
		if (this.Direction === undefined) { throw new IllegalStackOperationError('match'); }
		const top = this.peek()?.Value;
		if (top === undefined) {
			return;
		}
		const inBounds = this.Direction === Direction.Up ? top < Card.MAX_VALUE : top > Card.MIN_VALUE
		const rightDirection = this.Direction === Direction.Up ? (item.Value > top) : (item.Value < top);
		const jump = item.Value === top + Number(this.Direction) * 10 // up = 1, down = -1
		if (inBounds && (rightDirection || jump)) {
			return;
		} else {
			throw new CardMatchError(item, this);
		}
	}
	public override push(item: Card): number {
		if (this.Direction === undefined) {
			throw new IllegalStackOperationError('push');
		}
		this.match(item);
		return super.push(item);
	}
	public override pop(): Card {
		if (this.Direction != undefined) {
			throw new IllegalStackOperationError('pop');
		}
		return super.pop();
	}
	public override peek(): Card {
		if (this.Direction === undefined) {
			throw new IllegalStackOperationError('peek');
		}
		return super.peek();
	}
}
export enum Direction {
	Down = -1,
	Up = 1
}