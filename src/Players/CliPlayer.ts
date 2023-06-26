import { Card, CardStack, Direction, Game, Player } from '../mod.ts';
import { brightBlack } from "https://deno.land/std@0.182.0/fmt/colors.ts";
// types


/**
 * A Command Line Interface to play the game.
 */
export class CliPlayer extends Player {
	private static NEW_LINE: string = Deno.build.os === 'windows' ? '\r\n' : '\n';
	private encoder: TextEncoder = new TextEncoder();

	constructor() {
		super();
	}

	public override play(game: Game): Promise<void> {
		super.play(game);
		this.print(CliPlayer.NEW_LINE);
		this.print('Slots' + CliPlayer.NEW_LINE);
		game.Slots.forEach((slot) => {
			const digits = Card.MAX_VALUE.toString().length;
			this.print(`${' '.repeat(digits - 1)}${CliPlayer.point(slot.Direction as Direction)}${' '.repeat(digits - 1)}`);
		});

		this.print(CliPlayer.NEW_LINE);
		game.Slots.forEach((slot) => {
			this.printAvailables<CardStack>([slot], game, (slot) => {
				const top = slot.peek();
				return top?.toString() ?? `[${' '.repeat(Card.MAX_VALUE.toString().length)}]`;
			});
		});

		this.print(CliPlayer.NEW_LINE);
		this.print(`${game.DrawPile.length} cards left in the stack.` + CliPlayer.NEW_LINE);
		this.print('Your hand:' + CliPlayer.NEW_LINE);
		this.printAvailables<Card>(this.hand, game);
		this.print(CliPlayer.NEW_LINE);
		return new Promise((resolve) => {
			resolve();
		});
	}

	/** Prints the given subjects, highlighting the ones that are available to play. */
	private printAvailables< //TODO: naming
		// deno-lint-ignore ban-types
		T extends Object
	>(subjects: T[], game: Game, toString: (subject: T) => string = (subject: T) => subject.toString()): void {
		let availables: T[];
		if (subjects.every(subject => subject instanceof Card)) {
			availables = this.playableCards(game) as unknown as T[];
		} else if (subjects.every(subject => subject instanceof CardStack)) {
			availables = this.pushableSlots(game) as unknown as T[];
		}

		subjects.forEach((subject) => {
			const str = toString(subject)
			if (availables.includes(subject)) {
				this.print(str);
			} else {
				this.print(brightBlack(str));
			}
		});
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
