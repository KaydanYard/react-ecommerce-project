import { useEffect, useState } from "react";
import { Container, Message } from "semantic-ui-react";
import { Login, LoginFormValues } from "../../components/login";
import { useGlobalContext } from "../../contexts/global.context";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

export function LoginView() {
  const { state, onLogin } = useGlobalContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (state.loggedIn) {
      const redirect = searchParams.get('redirect')
      if (redirect) {
        navigate(redirect)
      } else {
        navigate("/companies")
      }
    }
  }, [state.loggedIn])

  const handleSignIn = async (formValues: LoginFormValues) => {
    const { username, password } = formValues;
    if (!username || !password) {
      return;
    }
    onLogin?.(username, password)
  }
  return (
    <Container style={{ width: 400, margin: 48 }}>
      {loading ? <span>Loading...</span> : null}
      <Login onSuccess={handleSignIn} />
      {state.error && <Message warning>{state.error}</Message>}
    </Container>
  );
}