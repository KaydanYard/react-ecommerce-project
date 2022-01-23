import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import API, { UserType } from '../dataLayer/api';

type GlobalState = {
  loggedIn: boolean;
  error?: string;
  loading?: boolean;
  user?: UserType;
}

type ProviderState = {
  state: GlobalState;
  onLogin?: (username: string, password: string) => void;
  onLogout?: () => void;
}

type Props = {
  children: ReactNode;
}

const GlobalContext = createContext<ProviderState>({ state: { loggedIn: false } });

export const useGlobalContext = () => {
  return useContext(GlobalContext);
}

// higher order component
export function GlobalContextProvider({ children }: Props) {
  const [state, setState] = useState<GlobalState>({ loggedIn: false })

  useEffect(() => {
    const userJSON = window.localStorage.getItem("logged-in-user");
    if (userJSON) {
      setState({ ...state, user: JSON.parse(userJSON) })
    }
  }, [])

  const handleLogin = async (username: string, password: string) => {
    setState({ ...state, loading: true })
    const { data, status, message } = await API.login(username, password);

    if (data && status === "success") {
      window.localStorage.setItem("logged-in-user", JSON.stringify(data));
      setState({ ...state, user: data, loggedIn: true, loading: false });
    } else {
      window.localStorage.removeItem("logged-in-user");
      setState({ loggedIn: false, error: message || "Something went wrong", loading: false });
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("logged-in-user")
    setState({ loggedIn: false })
  }

  return (
    <GlobalContext.Provider value={{
      state,
      onLogin: handleLogin,
      onLogout: handleLogout
    }}>
      {children}
    </GlobalContext.Provider>
  )
}