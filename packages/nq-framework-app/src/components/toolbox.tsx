import { Button, Flex, Text } from "@chakra-ui/react";
import { Action } from "@nqframework/models";
import * as React from "react";

export const Toolbox: React.FC<{ actions: Action[], addAction: (action: Action) => void }> = ({ actions, addAction }) => {
    return (
        <Flex dir="row" alignItems="center">
            <Text fontSize="xl">Dostupne Akcije:</Text>
            {(actions && actions.map) ? actions.map(a => (
                <Button key={a.id} mx={15} onClick={() => { addAction(a); }} >{a.name}</Button>
            )) : <Text>Nema dostupnih akcija</Text>}
        </Flex>
    )
}