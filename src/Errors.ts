import { Card, Stack } from './mod.ts';
export class EmptyStackError extends Error {
	constructor() {
		super('Stack is empty');
	}
}
export class IllegalStackOperationError extends Error {
	constructor(operation: string, reason?: string) {
		super(`Illegal to ${operation} this stack${reason != undefined ? ` because ${reason}` : ''}`);
	}
}
export class CardMatchError extends Error {
	constructor(card: Card, stack: Stack<Card>) {
		super(`Cannot match ${card} to ${stack.peek()}`);
	}
}
