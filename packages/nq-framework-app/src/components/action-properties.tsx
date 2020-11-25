import { Button, DrawerBody, DrawerHeader, FormControl, FormErrorMessage, FormLabel, Heading } from "@chakra-ui/react";
import { Action, ActionInstance, PropertyValue } from "@nqframework/models";
import { Field, Form, Formik } from "formik";
import * as React from "react";
import { InputControl } from "./input-control";

export const ActionProperties: React.FC<{ selected: { action: Action, instance: ActionInstance } | null, updateActionProperties: (actionInstanceName: string, propertyValues: PropertyValue[]) => Promise<void> }> = ({ selected, updateActionProperties }) => {
    if (!selected) {
        return null;
    }
    return (
        <>
            <DrawerHeader mt={4}>
                <Heading>{selected.instance.name}</Heading>
            </DrawerHeader>
            <DrawerBody>
                <Formik
                    initialValues={selected.instance.configuration.input.reduce((opt: any, i) => {
                        opt[i.name] = i.value
                        return opt;
                    }, {})}
                    onSubmit={(values, actions) => {
                        const mappedValues: PropertyValue[] = [];
                        Object.keys(values).forEach((v: string) => {
                            mappedValues.push({ name: v, value: values[v] });
                        });
                        updateActionProperties(selected.instance.name, mappedValues).then(() => {
                            actions.setSubmitting(false);
                        })
                    }}
                >
                    {(props) => (
                        <Form>
                            {(selected.action.properties ?? []).map(p => (
                                <Field name={p.name} key={p.name}>
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors[p.name] && form.touched[p.name]}>
                                            <FormLabel htmlFor={p.name}>{p.description}</FormLabel>
                                            <InputControl fieldProperty={p} {...field} id={p.name} placeholder={p.description} />
                                            <FormErrorMessage>{form.errors[p.name]}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                            ))}
                            <Button
                                mt={4}
                                colorScheme="teal"
                                isLoading={props.isSubmitting}
                                type="submit"
                            >
                                Potvrdi
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DrawerBody>
        </>
    )
}
