import { Button, Center, Flex, Grid, GridItem, Heading, Link } from "@chakra-ui/react";
import * as React from "react";
import { Layout } from "../components/layout";
import 'firebase/auth';
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";



export const HomePage: React.FC = () => {
    const user = useContext(AuthContext);
    const [fbInit, setFbInit] = useState(false);

    useEffect(() => {
        initPromise.then(() => {
            setFbInit(true);
        });
    }, []);

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

    const menu: { name: string, href: string }[] = [
        {
            name: "Data Credentials Types",
            href: "/data-credentials/types",
        },
        {
            name: "Action Types",
            href: "/action-types",
        },
        {
            name: "Data Credentials",
            href: "/data-credentials",
        },
        {
            name: "Workflows",
            href: "/workflows",
        },
    ]
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
                                        {menu.map(mi => (
                                            <Link as={RouterLink} to={mi.href} key={mi.name}>
                                                <Button m={4} w="190px" h="100px" >{mi.name}</Button>
                                            </Link>
                                        ))}
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
