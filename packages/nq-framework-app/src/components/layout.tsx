import * as React from "react";
import { Avatar, Divider, Flex, Grid, GridItem, Heading, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { useCallback, useContext } from "react";
import { AuthContext } from "../firebase/firebase-context";
import firebase from "firebase/app";
import 'firebase/auth';

export const Layout: React.FC = (props: any) => {
    const user = useContext(AuthContext);
    const logoutUser = useCallback(() => {
        firebase.auth().signOut();
    }, []);
    return (
        <Grid templateRows="60px 100px 1fr" height="100vh" width="100vw">
            <GridItem>
                <Flex justifyContent="space-between" alignItems="center" px={6} h="100%">
                    <Heading>NQ App</Heading>
                    {!!user && (
                        <Menu>
                            <MenuButton as={Avatar} name={user.displayName ?? 'unknown'} src={user.photoURL || ''} >
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Profile</MenuItem>
                                <MenuDivider />
                                <MenuItem onClick={() => { logoutUser(); }}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                        // <Avatar name={user.displayName ?? 'unknown'} src={user.photoURL || ''}  ></Avatar>
                    )}
                </Flex>
                <Divider borderBottomWidth="2px"></Divider>
            </GridItem>
            {props.children}
        </Grid >
    )
}