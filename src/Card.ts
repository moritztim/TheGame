export class Card extends Object {
	public static readonly MAX_VALUE = 99;
	public static readonly MIN_VALUE = 2;
	public readonly Value: number;
	constructor(Value: number) {
		super();
		if (!(Value <= Card.MAX_VALUE && Value >= Card.MIN_VALUE)) {
			throw new Error(`Card value must be from ${Card.MIN_VALUE} to ${Card.MAX_VALUE}, recieved ${Value}`);
		}
		this.Value = Value;
	}

	public override toString(): string {
		return `[${this.Value.toString().padStart(Card.MAX_VALUE.toString().length, ' ')}]`;
	}
	public override valueOf(): number {
		return this.Value;
	}
}
