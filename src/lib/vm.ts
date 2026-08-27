export class VM {
    public run(code: string): void {
        eval(code);
    }
}