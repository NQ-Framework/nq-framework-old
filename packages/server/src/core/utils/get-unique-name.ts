export const getUniqueName = (desiredName: string, takenNames: string[]): string => {
    let index = 0;
    while (takenNames.includes(desiredName + (index > 0 ? " " + index : ""))) {
        index++;
    }
    return desiredName + (index > 0 ? " " + index : "");
}