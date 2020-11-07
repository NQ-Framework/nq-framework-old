export class ConfigServiceBase {
    protected throwError(param: string): never {
        throw new Error(`missing configuration item: ${param}`);
    }
}