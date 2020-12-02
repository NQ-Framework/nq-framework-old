import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
} from '@chakra-ui/react';
import * as React from 'react';
import { Layout } from '../components/layout';
import 'firebase/auth';
import { AuthContext, initPromise } from '../firebase/firebase-context';
import { Redirect } from 'react-router-dom';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { WorkflowService } from '../services/workflow.service';
import { Workflow } from '@nqframework/models';
import { Field, Form, Formik } from 'formik';
import { organizationContext } from '../core/organization-context';

export const NewWorkflowPage: React.FC = () => {
  const workflowService = useMemo(() => new WorkflowService(), []);
  const user = useContext(AuthContext);
  const { organization } = useContext(organizationContext);
  const [fbInit, setFbInit] = useState(false);
  const [newWorkflowId, setNewWorkflowId] = useState('');

  useEffect(() => {
    initPromise.then(() => {
      setFbInit(true);
    });
  }, [user, workflowService]);

  const createWorkflow = useCallback(
    (name: string, cb: Function) => {
      workflowService
        .createWorkflow(name, organization?.name ?? '')
        .then((wf: Workflow) => {
          cb();
          setNewWorkflowId(wf.id);
        });
    },
    [workflowService, setNewWorkflowId, organization],
  );
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
  function validateName(value: string) {
    let error;
    if (!value) {
      error = 'Naziv je obavezan';
    } else if (value.length > 30) {
      error = 'Naziv može biti do 30 karaktera dužine';
    }
    return error;
  }
  if (newWorkflowId) {
    return <Redirect to={{ pathname: `/workflows/${newWorkflowId}` }} />;
  }
  return (
    <>
      {!user ? (
        <Redirect to={{ pathname: '/signin' }} />
      ) : (
        <Layout>
          <GridItem rowSpan={2}>
            <Grid templateColumns="1fr min(120ch, 100%) 1fr">
              <Box
                p={4}
                gridColumn={2}
                background="white"
                my={6}
                boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
              >
                <Formik
                  initialValues={{ name: 'Novi workflow' }}
                  onSubmit={(values, actions) => {
                    createWorkflow(values.name, () => {
                      actions.setSubmitting(false);
                    });
                  }}
                >
                  {(props) => (
                    <Form>
                      <Field name="name" validate={validateName}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <FormLabel htmlFor="name">
                              Naziv workflowa
                            </FormLabel>
                            <Input
                              {...field}
                              id="name"
                              placeholder="Novi Workflow"
                            />
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
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
              </Box>
            </Grid>
          </GridItem>
        </Layout>
      )}
    </>
  );
};
