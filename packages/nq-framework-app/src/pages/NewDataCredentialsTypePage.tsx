import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, HStack, Input, Text } from "@chakra-ui/react";
import * as React from "react";
import { Layout } from "../components/layout";
import 'firebase/auth';
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect } from "react-router-dom";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DataCredentialsService } from "../services/data-credentials.service";
import { DataCredentialsType } from "@nqframework/models";
import { Field, Form, Formik, FieldArray } from "formik";
import { Property } from "@nqframework/models/build/workflow/property/property";

export const NewDataCredentialsTypePage: React.FC = () => {
    const user = useContext(AuthContext);
    const [fbInit, setFbInit] = useState(false);
    const [fields, setFields] = useState<Property[]>([]);
    const [redirect, setRedirect] = useState(false);
    const service = useMemo<DataCredentialsService>(() => {
        return new DataCredentialsService();
    }, []);

    useEffect(() => {
        initPromise.then(() => {
            setFbInit(true);
        });
        setFields([{
            name: 'name',
            description: 'Naziv kredencijala',
            type: 'string',
            defaultValue: '',
            options: {
                visible: true,
                required: true
            }
        },
        {
            name: 'description',
            description: 'Opis kredencijala',
            type: 'string',
            defaultValue: '',
            options: {
                visible: true,
                required: true
            }
        },
        {
            name: 'isEnabled',
            description: 'U upotrebi',
            type: 'boolean',
            defaultValue: true,
            options: {
                visible: true,
                required: true
            }
        },
        {
            name: 'type',
            description: 'Tip (kratki naziv za referenciranje u kodu)',
            type: 'string',
            defaultValue: '',
            options: {
                visible: true,
                required: true
            }
        },
        {
            name: 'properties',
            description: 'Dodatna konfiguracija',
            type: 'array',
            defaultValue: [
            ],
            options: {
                visible: true,
                required: true
            }
        },
        ]);
    }, [setFields]);

    const createDataCredentialType = useCallback((values: any, cb: Function) => {
        const dct: DataCredentialsType = values as DataCredentialsType;
        return service.createDataCredentialType(dct).then(() => {
            cb();
            setRedirect(true);
        });
    }, [service, setRedirect]);

    if (!fbInit) {
        return (
            <Layout>
                <GridItem rowSpan={2}>
                    <Center h="100%">
                        <Heading>Loading...</Heading>
                    </Center>
                </GridItem>
            </Layout>
        );
    }
    if (redirect) {
        return (
            <Redirect to={{ pathname: "/data-credentials/types" }} />
        );
    }
    return (
        <>
            {!user ? (
                <Redirect to={{ pathname: "/signin" }} />
            ) : (
                    <Layout>
                        <GridItem rowSpan={2}>
                            <Grid templateColumns="1fr min(120ch, 100%) 1fr" py={12} >
                                <GridItem colStart={2}>
                                    <Formik
                                        initialValues={fields.reduce((obj: any, f) => { obj[f.name] = f.defaultValue; return obj; }, {})}
                                        onSubmit={(values, actions) => {
                                            createDataCredentialType(values, () => {
                                                actions.setSubmitting(false)
                                            });
                                        }}
                                    >
                                        {(props) => (
                                            <Form>
                                                {fields.map(f => {
                                                    if (f.type === "array") {
                                                        return (
                                                            <Box key={f.name}>
                                                                <FieldArray name={f.name}>
                                                                    {({ push, remove }) => (
                                                                        <>
                                                                            {
                                                                                props.values[f.name] && props.values[f.name].length > 0 ? (
                                                                                    props.values[f.name].map((arrayFieldInstance: { name: string, type: string }, index: number) => (
                                                                                        <HStack justify="center">
                                                                                            <Field key={`${f.name}.${index}.name`} name={`${f.name}.${index}.name`}>
                                                                                                {({ field, form }: any) => (
                                                                                                    <FormControl isInvalid={form.errors[`${f.name}.${index}`] && form.touched[`${f.name}.${index}`]}>
                                                                                                        <FormLabel htmlFor={`${f.name}.${index}`}>Naziv</FormLabel>
                                                                                                        <Input {...field} id={`${f.name}.${index}`} placeholder="Naziv" />
                                                                                                        <FormErrorMessage>{form.errors[`${f.name}.${index}`]}</FormErrorMessage>
                                                                                                    </FormControl>
                                                                                                )}
                                                                                            </Field>
                                                                                            <Field key={`${f.name}.${index}.type`} name={`${f.name}.${index}.type`}>
                                                                                                {({ field, form }: any) => (
                                                                                                    <FormControl isInvalid={form.errors[`${f.name}.${index}`] && form.touched[`${f.name}.${index}`]}>
                                                                                                        <FormLabel htmlFor={`${f.name}.${index}`}>Tip</FormLabel>
                                                                                                        <Input {...field} id={`${f.name}.${index}`} placeholder="Tip" />
                                                                                                        <FormErrorMessage>{form.errors[`${f.name}.${index}`]}</FormErrorMessage>
                                                                                                    </FormControl>
                                                                                                )}
                                                                                            </Field>
                                                                                            <Button onClick={() => { remove(index) }}>Izbaci</Button>
                                                                                        </HStack>
                                                                                    ))) : <Text>Nema definisanih vrednosti.</Text>
                                                                            }
                                                                            <Button onClick={() => { push({ name: '', type: '' }) }}>Dodaj vrednost</Button>
                                                                        </>
                                                                    )}
                                                                </FieldArray>
                                                            </Box>)
                                                    }

                                                    return (
                                                        <Field key={f.name} name={f.name}>
                                                            {({ field, form }: any) => (
                                                                <FormControl isInvalid={form.errors[f.name] && form.touched[f.name]}>
                                                                    <FormLabel htmlFor={f.name}>{f.description}</FormLabel>
                                                                    <Input {...field} id={f.name} placeholder={f.description} />
                                                                    <FormErrorMessage>{form.errors[f.name]}</FormErrorMessage>
                                                                </FormControl>
                                                            )}
                                                        </Field>
                                                    );
                                                })}
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
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Layout>
                )
            }
        </>
    );
};
