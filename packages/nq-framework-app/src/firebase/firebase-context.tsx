import * as React from "react";
import { createContext, useEffect, useState } from "react";
import app from "./config";
import firebase from "firebase/app"
import 'firebase/auth';

let resolveFbInit: any;
export const initPromise: Promise<void> = new Promise((resolve) => { resolveFbInit = resolve; });

export const AuthContext = createContext<firebase.User | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => { setUser(user); resolveFbInit(); });
  }, [setUser]);

  return (
    <AuthContext.Provider value={user}> { children} </AuthContext.Provider>
  );
};