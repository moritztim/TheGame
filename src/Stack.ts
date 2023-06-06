import { EmptyStackError } from "./mod.ts";

/** A stack is a data structure that follows the LIFO (last in first out) policy.
 * The last element added to the stack will be the first one removed.
 * The push() method adds an element to the top of the stack.
 * The pop() method removes and returns the top element in the stack.
 * The peek() method returns the top element in the stack without removing it.
*/
export class Stack<T> {
	public get length(): number { return this.items.length; }
	private _items: T[] = [];
	private get items(): T[] { if (this._items != undefined) { return this._items; } else { throw new EmptyStackError() } }
	private set items(items: T[]) { this._items = items; }
	constructor(items: T[] = []) {
		this.items = items;
	}

	/**
	 * Adds an item to the top of the stack and returns the new length of the stack.
	 * @param item The item to add to the stack.
	 * @returns The new length of the stack.
	 * @see {@link Array.push}
	 */
	public push(item: T): number {
		return this.items.push(item);
	}
	/**
	 * Removes and returns the top element in the stack.
	 * @returns The top element in the stack.
	 * @see {@link Array.pop}
	 */
	public pop(): T {
		return this.items.pop() as T;
	}
	/**
	 * Returns the top element in the stack without removing it.
	 * @returns The top element in the stack.
	 */
	public peek(): T {
		return this.items[this.items.length - 1];
	}
}