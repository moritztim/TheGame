import { Card, Slot, Direction, Game, Player } from '../mod.ts';
import { brightBlack } from "https://deno.land/std@0.182.0/fmt/colors.ts";
// types


/**
 * A Command Line Interface to play the game.
 */
export class CliPlayer extends Player {
	private static NEW_LINE: string = Deno.build.os === 'windows' ? '\r\n' : '\n';

	/** Encoder for printing */
	private encoder: TextEncoder = new TextEncoder();

	constructor() {
		super();
	}

	public override play(game: Game): Promise<void> {
		super.play(game);

		let out = '';

		out += CliPlayer.NEW_LINE;
		out += 'Slots' + CliPlayer.NEW_LINE;
		game.Slots.forEach((slot) => {
			const digits = Card.MAX_VALUE.toString().length; // The amount of space to reserve for each slot
			out += `${' '.repeat(digits - 1)}${CliPlayer.point(slot.Direction)}${' '.repeat(digits - 1)}` // Pointing emoji with padding
		});

		out += CliPlayer.NEW_LINE;
		out += this.highlightAvailables<Slot>(
			game.Slots,
			game,
			(slot) => {
				const top = slot.peek();
				return top?.toString() ?? `[${' '.repeat(Card.MAX_VALUE.toString().length)}]`;
			}
		);

		out += CliPlayer.NEW_LINE;
		out += `${game.DrawPile.length} cards left in the draw pile.` + CliPlayer.NEW_LINE;
		out += 'Your hand:' + CliPlayer.NEW_LINE;
		out += this.highlightAvailables<Card>(this.hand, game);
		out += CliPlayer.NEW_LINE;
		
		this.print(out);
		
		return new Promise((resolve) => {
			resolve();
		});
	}

	/** Highlights the subjects that are available to play. */
	private highlightAvailables<
		// deno-lint-ignore ban-types
		T extends Object
	>(subjects: T[], game: Game, toString: (subject: T) => string = (subject: T) => subject.toString()): string {
		let result = '';
		
		let availables: T[];
		if (subjects.every(subject => subject instanceof Card)) { // if we're printing cards
			availables = this.playableCards(game) as unknown as T[];
		} else if (subjects.every(subject => subject instanceof Slot)) { // if we're printing slots
			availables = this.pushableSlots(game) as unknown as T[];
		}

		subjects.forEach((subject) => {
			const str = toString(subject) // call the given toString function
			if (availables.includes(subject)) {
				result += str; // highlight
			} else {
				result += brightBlack(str); // gray out
			}
		});

		return result;
	}

	/**
	 * @returns The pointing emoji for the given direction.
	 */
	private static point(direction: Direction): '👆' | '👇' {
		return direction === Direction.Up ? '👆' : '👇';
	}

	/** Encodes and prints to stdout. */
	private print(message: string): void {
		Deno.stdout.writeSync(this.encoder.encode(message));
	}
}
