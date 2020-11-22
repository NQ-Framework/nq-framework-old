import { Box, Center, Flex, Grid, GridItem, Heading, HStack, Icon, Link, Tag, TagLabel, TagLeftIcon, Text } from "@chakra-ui/react";
import * as React from "react";
import { Layout } from "../components/layout";
import 'firebase/auth';
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect, Link as RouterLink } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { WorkflowService } from "../services/workflow.service";
import { Workflow } from "@nqframework/models";
import { TiFlowChildren } from "react-icons/ti";
import { VscDebugStart } from "react-icons/vsc"
import { CgAddR } from "react-icons/cg"



export const WorkflowsPage: React.FC = () => {
    const workflowService = useMemo(() => new WorkflowService(), []);
    const user = useContext(AuthContext);
    const [fbInit, setFbInit] = useState(false);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);

    useEffect(() => {
        initPromise.then(() => {
            setFbInit(true);
            if (!user) {
                return;
            }
            workflowService.getWorkflows().then((wfs) => {
                setWorkflows(wfs);
            });
        });
    }, [user, workflowService]);
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
                            <Grid templateColumns="1fr min(120ch, 100%) 1fr" h="100%">
                                <Box gridColumn={2}>
                                    <Flex wrap="wrap">
                                        {workflows.map(w => (
                                            <Link as={RouterLink} to={`/workflows/${w.id}`} key={w.id} _hover={{ filter: "brightness(80%)" }} transition="0.3s" background="blue.600" h="100px" w="190px" p={2} my={6} mx={4} borderRadius="4px" d="flex" flexDir="column" justifyContent="space-between">
                                                <Text color="white" fontWeight="bold">{w.name}</Text>
                                                <HStack>
                                                    <Tag size="sm" variant="subtle" colorScheme="cyan">
                                                        <TagLeftIcon boxSize="12px" as={TiFlowChildren} />
                                                        <TagLabel>{w.actionInstances.length}</TagLabel>
                                                    </Tag>
                                                    {w.triggers.map(t => (
                                                        <Tag size="sm" key={t.id} variant="subtle" colorScheme="cyan">
                                                            <TagLeftIcon boxSize="12px" as={VscDebugStart} />
                                                            <TagLabel>{t.type}</TagLabel>
                                                        </Tag>
                                                    ))}
                                                </HStack>
                                            </Link>
                                        ))}
                                        <Link as={RouterLink} to="/workflows/new" _hover={{ filter: "brightness(80%)" }} transition="0.3s" background="gray.300" h="100px" w="190px" p={2} my={6} mx={4} borderRadius="4px">
                                            <Center h="100%">
                                                <Icon w={12} h={12} as={CgAddR} opacity="0.4"></Icon>
                                            </Center>
                                        </Link>
                                    </Flex>
                                </Box>
                            </Grid>
                        </GridItem>
                        {/* <GridItem padding={6}>
                            <Text width="100%" textAlign="center">Workflows</Text>
                        </GridItem>
                        <GridItem>
                            {workflows.map(w => (
                                <Link href={`/workflows/${w.id}`} ><Box><Heading>{w.name}</Heading></Box></Link>
                            ))}
                        </GridItem> */}
                    </Layout>
                )
            }
        </>
    );
};
