import { Node as ESTreeNode } from 'estree';
export type Ast = { body: ESTreeNode[] };

export interface StaticValue {
  value: any;
  wildcards?: string[];
}

export interface ConditionalValue {
  test: string;
  ifTrue: any;
  else: any;
}

export type EvaluatedValue = StaticValue | ConditionalValue | undefined;

declare module 'estree' {
  interface BaseNode {
    start?: number;
    end?: number;
    [propName: string]: any;
  }
}

/**
 * A more lax version of the 'estree' Node type
 */
export type Node = ESTreeNode;
