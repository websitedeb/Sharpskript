export class VM {
    public run(code: string): void {
        try{
            eval(code);
        } catch (e) {
            console.error("Error Occured: " + e);
        }
    }
}