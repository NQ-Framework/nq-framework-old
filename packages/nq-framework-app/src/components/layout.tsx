import * as React from "react";
import { Grid } from "@chakra-ui/react";

export const Layout: React.FC = (props: any) => {
    return (
        <Grid templateRows="100px 1fr" height="100vh" width="100vw">
            {props.children}
        </Grid >
    )
}