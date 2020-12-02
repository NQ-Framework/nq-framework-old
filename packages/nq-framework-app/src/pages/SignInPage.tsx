import { GridItem, Text } from '@chakra-ui/react';
import * as React from 'react';
import { Layout } from '../components/layout';
import firebase from 'firebase/app';
import 'firebase/auth';
import { FirebaseAuth } from 'react-firebaseui';
import { AuthContext } from '../firebase/firebase-context';
import { Redirect } from 'react-router-dom';
import { useContext } from 'react';

const uiConfig: any = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

export const SignInPage: React.FC = () => {
  const user = useContext(AuthContext);

  return (
    <>
      {!!user ? (
        <Redirect to={{ pathname: '/' }} />
      ) : (
        <Layout>
          <GridItem padding={6}>
            <Text width="100%" textAlign="center">
              Please Sign In
            </Text>
          </GridItem>
          <GridItem>
            <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          </GridItem>
        </Layout>
      )}
    </>
  );
};
