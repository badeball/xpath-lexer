export default class XPathLexer {
    private tokens;
    private index;
    constructor(expression: string);
    length(): number;
    next(): string | null;
    back(): void;
    peak(n?: number): string;
    empty(): boolean;
    position(): number;
}
