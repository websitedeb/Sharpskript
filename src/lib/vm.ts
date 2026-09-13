export class VM {
    public run(code: string): void {
        try{
            eval(code);
        } catch (err) {
            console.error("Runtime Error Occured: " + err);
        }
    }
}