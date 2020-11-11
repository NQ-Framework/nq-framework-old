export type StoredProcedureConfiguration = {
    type: "stored-procedure",
    name: string
    parameters: ProcedureParameter[]
    outParameters: ProcedureParameter[]
    dataSource: string
}

export type ProcedureParameter = {
    name: string,
    type: string,
    value: any
}