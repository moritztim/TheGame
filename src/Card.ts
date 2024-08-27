export class Card extends Object {
	/** Maximum value of a card */
	static readonly MAX_VALUE = 99;
	/** Minimum value of a card */
	static readonly MIN_VALUE = 2;

	readonly value: number;

	constructor(value: number) {
		super();
		if (!(value <= Card.MAX_VALUE && value >= Card.MIN_VALUE)) { // Out of bounds
			throw new Error(`Card value must be from ${Card.MIN_VALUE} to ${Card.MAX_VALUE}, received ${value}`);
		}
		this.value = value;
	}

	/**
	 * @returns a string representation of the card with universal padding
	 */
	override toString(): string {
		return `[${this.value.toString().padStart(Card.MAX_VALUE.toString().length, ' ')}]`; // Pad with spaces to make all cards the same length
	}

	override valueOf(): number {
		return this.value;
	}
}
