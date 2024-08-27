#!/usr/bin/env -S deno run

import { Card, CliPlayer, Game } from '../src/mod.ts';
while (true) {
	const game = new Game([new CliPlayer()]);
	game.slots.forEach((slot) => {
		slot.push(new Card(Math.floor(Math.random() * (Card.MAX_VALUE - Card.MIN_VALUE + 1)) + Card.MIN_VALUE));
	});
	game.play();
	//wait for space press in the stdin
	await new Promise((resolve) => {
		Deno.stdin.read(new Uint8Array(1)).then(resolve);
	});
	//clear output
	console.log('\x1B[2J\x1B[0f');
}