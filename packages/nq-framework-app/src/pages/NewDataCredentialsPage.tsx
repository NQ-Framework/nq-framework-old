import { Button, Center, FormControl, FormLabel, Grid, GridItem, Heading, Input, Select } from "@chakra-ui/react";
import * as React from "react";
import { Layout } from "../components/layout";
import 'firebase/auth';
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect } from "react-router-dom";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DataCredentialsService } from "../services/data-credentials.service";
import { DataCredentialsType } from "@nqframework/models";
import { Field, Form, Formik } from "formik";
import { organizationContext } from "../core/organization-context";
import { Property } from "@nqframework/models/build/workflow/property/property";

export const NewDataCredentialsPage: React.FC = () => {
    const user = useContext(AuthContext);
    const { organization } = useContext(organizationContext);
    const [fbInit, setFbInit] = useState(false);
    const [dataCredentialsTypes, setDataCredentialsTypes] = useState<DataCredentialsType[]>([]);
    const [redirect, setRedirect] = useState(false);
    const [fields, setFields] = useState<Property[]>([]);
    const [initialValues, setInitialValues] = useState<any>();
    const service = useMemo<DataCredentialsService>(() => {
        return new DataCredentialsService();
    }, []);

    useEffect(() => {
        initPromise.then(() => {
            setFbInit(true);
        });
        service.getDataCredentialsTypes().then((crs) => {

            const values: any = { name: '', type: '', configuration: {} };
            crs.forEach(c => {
                c.properties.forEach(p => {
                    values.configuration[p.name] = "";
                });
            });
            setInitialValues(values);
            setDataCredentialsTypes(crs);
        });
    }, [setDataCredentialsTypes, service, setInitialValues]);

    const createDataCredential = useCallback((values: any, cb: Function) => {
        const dct = dataCredentialsTypes.find(t => t.type === values.type);
        const keysFromFields = fields.map(f => f.name);
        const dc: any = { name: values.name, type: values.type, credentialsType: dct, configuration: [] };
        keysFromFields.forEach(k => {
            dc.configuration.push({ name: k, value: values.configuration[k] });
        });
        return service.createDataCredentials(dc, organization?.name ?? "").then(() => {
            cb();
            setRedirect(true);
        });
    }, [service, setRedirect, organization, fields, dataCredentialsTypes]);

    const generateFormForType = useCallback((type: string) => {
        const dct = dataCredentialsTypes.find(d => d.type === type);
        if (!dct) {
            setFields([]);
            return;
        }
        setFields(dct.properties);
    }, [dataCredentialsTypes, setFields]);

    if (!fbInit || !dataCredentialsTypes || dataCredentialsTypes.length === 0) {
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
            <Redirect to={{ pathname: "/data-credentials/" }} />
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
                                        initialValues={initialValues}
                                        onSubmit={(values, actions) => {
                                            createDataCredential(values, () => {
                                                actions.setSubmitting(false)
                                            });
                                        }}
                                    >
                                        {(props) => (
                                            <Form>
                                                <Field name={"type"}>
                                                    {({ field }: any) => (
                                                        <FormControl>
                                                            <FormLabel htmlFor={"type"}>Tip kredencijala</FormLabel>
                                                            <Select {...field} onChange={(e) => { generateFormForType(e.target.value); props.setFieldValue("type", e.target.value); }} id={"type"} placeholder="Tip kredencijala" >
                                                                {dataCredentialsTypes.map(t => (
                                                                    <option key={t.type} value={t.type}>{t.name}</option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                </Field>
                                                <Field name={"name"}>
                                                    {({ field }: any) => (
                                                        <FormControl>
                                                            <FormLabel htmlFor={"name"}>Naziv</FormLabel>
                                                            <Input {...field} id={"name"} placeholder="Naziv kredencijala" />
                                                        </FormControl>
                                                    )}
                                                </Field>
                                                {fields && fields.map(f => (
                                                    <Field key={"configuration." + f.name} name={"configuration." + f.name}>
                                                        {({ field }: any) => (
                                                            <FormControl>
                                                                <FormLabel htmlFor={"configuration." + f.name}>{f.name}</FormLabel>
                                                                <Input {...field} id={"configuration." + f.name} placeholder={f.name} />
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
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Layout>
                )
            }
        </>
    );
};
