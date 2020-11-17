import { NodeVM, NodeVMOptions } from 'vm2';

export const evaluateExpression = async (
    expression: string,
    context: any,
): Promise<any> => {
    const sandbox = {
        ...context,
    };

    const options: NodeVMOptions = {
        console: 'inherit',
        sandbox,
        require: {
            external: false as boolean,
            builtin: [] as string[],
        },
    };
    const vm = new NodeVM(options);
    const result = await vm.run(
        `module.exports = async function() {${expression}}()`,
        __dirname,
    );
    return result;
}