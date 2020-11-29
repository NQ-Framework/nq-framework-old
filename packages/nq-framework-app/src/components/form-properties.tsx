import { Box, Button, Text } from "@chakra-ui/react";
import { Property } from "@nqframework/models/build/workflow/property/property";
import { FieldArray, FormikProps } from "formik";
import * as React from "react";
import { FormProperty } from "./form-property";



const propName = (prop: Property, prefix: string | null, index: number | null) => {
    return `${prefix !== null ? prefix + "." : ""}${prop.name}${index !== null ? "." + index : ""}`
}



export const FormProperties: React.FC<{ formikProps: FormikProps<any>, propsToRender: Property[] | undefined, prefix: string | null, index: number | null }> = ({ formikProps, propsToRender, prefix, index }) => {
    const renderArray = (p: Property) => {
        return (
            <Box key={p.name}>
                <Text>{(formikProps.values[propName(p, prefix, null)] && formikProps.values[propName(p, prefix, null)].length) ? `${p.description} list:` : `No ${p.description} defined`}</Text>
                <FieldArray key={propName(p, prefix, index)} name={propName(p, prefix, index)}>
                    {({ push, remove }) => (
                        <>
                            {(formikProps.values[propName(p, prefix, null)] && formikProps.values[propName(p, prefix, null)].length ? formikProps.values[propName(p, prefix, null)] : [])
                                .map((fp: any, subIndex: number) => (
                                    <Box key={propName(p, prefix, subIndex)}>
                                        <FormProperties index={subIndex} prefix={prefix} formikProps={formikProps} propsToRender={[{ ...p, type: p.arrayType as any }]} key={p.name} />
                                        <Button onClick={() => { remove(subIndex); }}>remove</Button>
                                    </Box>
                                ))}
                            <Button my={8} onClick={() => { push(''); }}>Add {p.description}</Button>
                        </>
                    )}
                </FieldArray>
            </Box>
        )
    }

    return (
        <>
            {
                (propsToRender || []).map(p => {
                    if (p.type === "array") {
                        return renderArray(p)
                    }
                    if (p.type === "object") {
                        return <FormProperties index={null} prefix={propName(p, prefix, index)} formikProps={formikProps} propsToRender={p.objectDefinition} key={p.name} />
                    }
                    return <FormProperty formikProps={formikProps} prop={{ ...p, name: propName(p, prefix, index) }} key={p.name} />
                })
            }
        </>
    )
}