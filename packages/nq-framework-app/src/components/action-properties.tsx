import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Divider, DrawerBody, DrawerHeader, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Action, ActionInstance, ActionLink, PropertyValue, Workflow } from "@nqframework/models";
import { Form, Formik } from "formik";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { convertFormValuesToProperties, convertPropertiesToFormValues } from "../core/form-helpers";
import { FormProperties } from "./form-properties";

export const ActionProperties: React.FC<{ deleteAction: (action: ActionInstance) => Promise<void>, deleteLink: (link: ActionLink) => Promise<void>, selected: { action: Action, instance: ActionInstance, } | null, workflow: Workflow | null, updateActionProperties: (actionInstanceName: string, propertyValues: PropertyValue[]) => Promise<void> }> = ({ selected, updateActionProperties, workflow, deleteAction, deleteLink }) => {

    const [outgoingLinks, setOutgoingLinks] = useState<ActionLink[]>([]);
    const [incomingLinks, setIncomingLinks] = useState<ActionLink[]>([]);

    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
    const [deleteTargetType, setDeleteTargetType] = React.useState<(ActionLink & ActionInstance) | null>(null)
    const onCloseDelete = () => setIsDeleteOpen(false)
    const onDeleteItem = useCallback(() => {
        if (!deleteTargetType) {
            setIsDeleteOpen(false)
            return;
        }
        if (deleteTargetType?.fromName) {
            deleteLink(deleteTargetType as ActionLink).then(() => {
                setIsDeleteOpen(false);
            }).catch(() => {
                setIsDeleteOpen(false);
            })
        }
        else {
            deleteAction(deleteTargetType as ActionInstance).then(() => {
                setIsDeleteOpen(false);
            }).catch(() => {
                setIsDeleteOpen(false);
            })
        }
    }, [setIsDeleteOpen, deleteAction, deleteLink, deleteTargetType]);
    const cancelButtonRef = React.useRef<any>(null)

    useEffect(() => {
        if (workflow && selected) {
            setOutgoingLinks(workflow.actionLinks.filter(al => al.fromName === selected.instance.name))
            setIncomingLinks(workflow.actionLinks.filter(al => al.toName === selected.instance.name))
        }
    }, [workflow, setOutgoingLinks, setIncomingLinks, selected])

    if (!selected) {
        return null;
    }

    const initialValues = convertPropertiesToFormValues(selected.instance.configuration.input);


    const incomingLinksComponent = incomingLinks && incomingLinks.length > 0 ? (
        <Box my={4}>
            <Text>Incoming connections:</Text>
            {incomingLinks.map(il => (
                <Flex my={2} h="100%" justifyContent="space-between" alignItems="center" key={il.fromName + il.toName}>
                    <Text>{il.fromName}</Text>
                    <Button colorScheme="blue" w="50%" onClick={() => {
                        setDeleteTargetType(il as any);
                        setIsDeleteOpen(true);
                    }}>Unlink</Button>
                </Flex>
            ))}
        </Box>
    ) : null;
    const outgoingLinksComponent = outgoingLinks && outgoingLinks.length > 0 ? (
        <Box my={4}>
            <Text>Outgoing connections:</Text>
            {outgoingLinks.map(ol => (
                <Flex my={2} h="100%" justifyContent="space-between" alignItems="center" key={ol.fromName + ol.toName}>
                    <Text>{ol.toName}</Text>
                    <Button colorScheme="blue" w="50%" onClick={() => {
                        setDeleteTargetType(ol as any);
                        setIsDeleteOpen(true);
                    }}>Unlink</Button>
                </Flex>
            ))}
        </Box>
    ) : null;

    return (
        <>
            <DrawerHeader mt={4}>
                <Heading>{selected.instance.name}</Heading>
            </DrawerHeader>
            <DrawerBody>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        const result = convertFormValuesToProperties(values);
                        updateActionProperties(selected.instance.name, result).then(() => {
                            actions.setSubmitting(false);
                        })
                    }}
                >
                    {(props) => (
                        <Form>
                            <Stack>
                                <FormProperties prefix={null} index={null} formikProps={props} propsToRender={selected.action.properties} />
                                <Button
                                    mt={4}
                                    colorScheme="teal"
                                    isLoading={props.isSubmitting}
                                    type="submit"
                                >
                                    Save
                        </Button>
                                {/* <pre>
                                    {JSON.stringify(props, null, 2)}
                                </pre> */}
                            </Stack>
                        </Form>
                    )}
                </Formik>
                <Divider my={3} orientation="horizontal" />
                <Text my={2}>Danger zone</Text>
                <Stack>
                    {incomingLinksComponent}
                    {outgoingLinksComponent}
                    <Button w="100%" colorScheme="red" onClick={() => {
                        setDeleteTargetType(selected.instance as any);
                        setIsDeleteOpen(true);
                    }}>Delete Action</Button>
                </Stack>
            </DrawerBody>

            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelButtonRef}
                onClose={onCloseDelete}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete {deleteTargetType?.fromName ? "Link" : "Action"}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelButtonRef} onClick={onCloseDelete}>
                                Cancel
              </Button>
                            <Button colorScheme="red" onClick={onDeleteItem} ml={3}>
                                Delete
              </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}
