import { Button, Center, Flex, Grid, GridItem, Heading, Icon, Link } from "@chakra-ui/react";
import * as React from "react";
import { Layout } from "../components/layout";
import 'firebase/auth';
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { DataCredentialsService } from "../services/data-credentials.service";
import { DataCredentials } from "@nqframework/models";
import { CgAddR } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom"
import { organizationContext } from "../core/organization-context";

export const DataCredentialsPage: React.FC = () => {
    const user = useContext(AuthContext);
    const [fbInit, setFbInit] = useState(false);
    const [dataCredentials, setDataCredentials] = useState<DataCredentials[]>([]);
    const { organization } = useContext(organizationContext);
    const service = useMemo<DataCredentialsService>(() => {
        return new DataCredentialsService();
    }, []);

    useEffect(() => {
        initPromise.then(() => {
            setFbInit(true);
        });
        setDataCredentials(organization?.dataCredentials ?? []);
    }, [service, organization]);

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

    return (
        <>
            {!user ? (
                <Redirect to={{ pathname: "/signin" }} />
            ) : (
                    <Layout>
                        <GridItem rowSpan={2}>
                            <Grid templateColumns="1fr min(120ch, 100%) 1fr" py={12} >
                                <GridItem colStart={2}>
                                    <Flex>
                                        {dataCredentials.map(dc => (
                                            <Button _hover={{ filter: "brightness(80%)" }} transition="0.3s" background="blue.300" h="100px" w="190px" p={2} my={6} mx={4} key={dc.name}>{dc.name}</Button>
                                        ))}
                                        <Link as={RouterLink} to="/data-credentials/new" _hover={{ filter: "brightness(80%)" }} transition="0.3s" background="gray.300" h="100px" w="190px" p={2} my={6} mx={4} borderRadius="4px">
                                            <Center h="100%">
                                                <Icon w={12} h={12} as={CgAddR} opacity="0.4"></Icon>
                                            </Center>
                                        </Link>
                                    </Flex>
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Layout>
                )
            }
        </>
    );
};
