export class Card extends Object {
	/** Maximum value of a card */
	static readonly MAX_VALUE = 99;
	/** Minimum value of a card */
	static readonly MIN_VALUE = 2;

	readonly Value: number;

	constructor(Value: number) {
		super();
		if (!(Value <= Card.MAX_VALUE && Value >= Card.MIN_VALUE)) { // Out of bounds
			throw new Error(`Card value must be from ${Card.MIN_VALUE} to ${Card.MAX_VALUE}, recieved ${Value}`);
		}
		this.Value = Value;
	}

	/**
	 * @returns a string representation of the card with universal padding
	 */
	override toString(): string {
		return `[${this.Value.toString().padStart(Card.MAX_VALUE.toString().length, ' ')}]`; // Pad with spaces to make all cards the same length
	}

	override valueOf(): number {
		return this.Value;
	}
}
