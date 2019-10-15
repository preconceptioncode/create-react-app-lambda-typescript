import { useState } from "react";

export default function useAuthentication() {
  const [username, setUsername] = useState();
  const [authenticated, setAuthenticated] = useState(false);
  const logIn = () => setAuthenticated(true);
  const logOut = () => setAuthenticated(false);
  return {
    authenticated,
    logIn,
    logOut,
    username,
    setUsername
  };
}
