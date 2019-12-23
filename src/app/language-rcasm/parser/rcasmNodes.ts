'use strict';

export enum NodeType {
    Assembly
}

export class Node {

	public parent: Node | null;
	
    public offset: number;
    public length: number;
	public get end() { return this.offset + this.length; }

	private children: Node[] | undefined;

    private nodeType: NodeType | undefined;
    
    constructor(offset: number = -1, len: number = -1, nodeType?: NodeType) {
		this.parent = null;
		this.offset = offset;
		this.length = len;
		if (nodeType) {
			this.nodeType = nodeType;
		}
    }
	
	public accept(visitor: IVisitorFunction): void {
		if (visitor(this) && this.children) {
			for (const child of this.children) {
				child.accept(visitor);
			}
		}
	}
}

export class Assembly extends Node {

	constructor(offset: number, length: number) {
		super(offset, length);
	}

	public get type(): NodeType {
		return NodeType.Assembly;
	}
}

export interface IVisitorFunction {
	(node: Node): boolean;
}