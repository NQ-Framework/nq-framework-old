import { NodeVM, NodeVMOptions } from 'vm2';
import {format, addDays, subDays, addHours, subHours }from "date-fns";

export const evaluateExpression = async (
  expression: string,
  context: any,
): Promise<any> => {
  const sandbox = {
    ...context,
    dateFns: {format, addDays, subDays, addHours, subHours}
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
};
