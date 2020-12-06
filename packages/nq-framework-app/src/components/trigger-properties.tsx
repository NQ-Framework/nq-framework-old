import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  DrawerBody,
  DrawerHeader,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  Workflow,
  WorkflowTrigger,
  WorkflowTriggerInstance,
} from '@nqframework/models';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
  convertFormValuesToProperties,
  convertPropertiesToFormValues,
} from '../core/form-helpers';
import { FormProperties } from './form-properties';

export const TriggerProperties: React.FC<{
  deleteTrigger: (triggerId: string) => Promise<void>;
  updateTrigger: (trigger: WorkflowTriggerInstance) => Promise<void>;
  selected: {
    trigger: WorkflowTriggerInstance;
    triggerDefinition: WorkflowTrigger;
  } | null;
  workflow: Workflow | null;
}> = ({ selected, workflow, deleteTrigger, updateTrigger }) => {
  const [outgoingLinks, setOutgoingLinks] = useState<string[]>([]);

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteTargetType, setDeleteTargetType] = React.useState<
    ({ actionName: string } & WorkflowTriggerInstance) | null
  >(null);
  const onCloseDelete = () => setIsDeleteOpen(false);
  const onDeleteItem = useCallback(() => {
    if (!deleteTargetType) {
      setIsDeleteOpen(false);
      return;
    }
    if (deleteTargetType?.actionName) {
      if (!selected) {
        return;
      }
      const updatedTrigger = {
        ...selected.trigger,
        actions: selected.trigger.actions.filter(
          (a) => a !== deleteTargetType.actionName,
        ),
      };
      updateTrigger(updatedTrigger)
        .then(() => {
          setIsDeleteOpen(false);
        })
        .catch(() => {
          setIsDeleteOpen(false);
        });
    } else {
      if (!selected) {
        return;
      }
      deleteTrigger(selected.trigger.id)
        .then(() => {
          setIsDeleteOpen(false);
        })
        .catch(() => {
          setIsDeleteOpen(false);
        });
    }
  }, [
    setIsDeleteOpen,
    updateTrigger,
    deleteTrigger,
    selected,
    deleteTargetType,
  ]);
  const cancelButtonRef = React.useRef<any>(null);

  useEffect(() => {
    if (workflow && selected) {
      setOutgoingLinks(selected.trigger?.actions ?? []);
    }
  }, [workflow, setOutgoingLinks, selected]);

  if (!selected) {
    return null;
  }

  const initialValues = convertPropertiesToFormValues(selected.trigger.input);

  const outgoingLinksComponent =
    outgoingLinks && outgoingLinks.length > 0 ? (
      <Box my={4}>
        <Text>Outgoing connections:</Text>
        {outgoingLinks.map((ol) => (
          <Flex
            my={2}
            h="100%"
            justifyContent="space-between"
            alignItems="center"
            key={ol}
          >
            <Text>{ol}</Text>
            <Button
              colorScheme="blue"
              w="50%"
              onClick={() => {
                setDeleteTargetType({ actionName: ol } as any);
                setIsDeleteOpen(true);
              }}
            >
              Unlink
            </Button>
          </Flex>
        ))}
      </Box>
    ) : null;

  return (
    <>
      <DrawerHeader mt={4}>
        <Heading>{selected.trigger.type}</Heading>
      </DrawerHeader>
      <DrawerBody>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            const result = convertFormValuesToProperties(values);
            updateTrigger({
              ...selected.trigger,
              input: result,
            } as any).then(() => {
              actions.setSubmitting(false);
            });
          }}
        >
          {(props) => (
            <Form>
              <Stack>
                <FormProperties
                  prefix={null}
                  index={null}
                  formikProps={props}
                  propsToRender={selected.triggerDefinition.inputProperties}
                />
                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
                <pre>{JSON.stringify(props, null, 2)}</pre>
              </Stack>
            </Form>
          )}
        </Formik>
        <Divider my={3} orientation="horizontal" />
        <Text my={2}>Danger zone</Text>
        <Stack>
          {outgoingLinksComponent}
          <Button
            w="100%"
            colorScheme="red"
            onClick={() => {
              setDeleteTargetType(selected.trigger as any);
              setIsDeleteOpen(true);
            }}
          >
            Delete Trigger
          </Button>
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
              Delete {deleteTargetType?.actionName ? 'Link' : 'Trigger'}
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
  );
};
