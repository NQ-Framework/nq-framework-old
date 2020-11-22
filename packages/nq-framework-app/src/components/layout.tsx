import * as React from "react";
import { Avatar, Divider, Flex, Grid, GridItem, Heading, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuOptionGroup, MenuItemOption } from "@chakra-ui/react";
import { useCallback, useContext } from "react";
import { Link as RouterLink } from "react-router-dom"
import { AuthContext } from "../firebase/firebase-context";
import firebase from "firebase/app";
import 'firebase/auth';
import { organizationContext } from "../core/organization-context";

export const Layout: React.FC = (props: any) => {
    const user = useContext(AuthContext);
    const { organization, organizations, setOrganization } = useContext(organizationContext);
    const logoutUser = useCallback(() => {
        firebase.auth().signOut();
    }, []);
    return (
        <Grid templateRows="60px 160px 1fr" height="100vh" width="100vw" background="#F5F7F9">
            <GridItem background="white">
                <Flex justifyContent="space-between" alignItems="center" px={6} h="100%">
                    <Link as={RouterLink} to="/">
                        <Heading>NQ App</Heading>
                    </Link>
                    <Heading>{organization ? organization.name : "nema organizacije"}</Heading>
                    {!!user && (
                        <Menu closeOnSelect={false}>
                            <MenuButton as={Avatar} name={user.displayName ?? 'unknown'} src={user.photoURL || ''} >
                            </MenuButton>
                            <MenuList>
                                <MenuOptionGroup defaultValue={organization?.name ?? ""} title="Organizacija" type="radio" onChange={(val) => {
                                    const org = organizations.find(o => o.name === val);
                                    if (org) {
                                        setOrganization(org);
                                    }
                                }}>
                                    {organizations.map(o => (
                                        <MenuItemOption key={o.name} value={o.name}>{o.name}</MenuItemOption>
                                    ))}
                                </MenuOptionGroup>
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