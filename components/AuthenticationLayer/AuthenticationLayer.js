/* import {
  useEffect,
  useState
} from 'react'; */

const AuthenticationLayer = ({ children }) => {
 // const [authenticated, setAuthenticated] = useState();

  // useEffect(() => {
  //   const authenticate = async password => {
  //     const response = await fetch(`${origin}/api/authenticate`, {
  //       headers: { Authorization: password }
  //     });

  //     const authenticated = response.status === 200;
  //     if (!authenticated) {
  //       // eslint-disable-next-line no-alert
  //       localStorage.password = prompt('Access denied', '');
  //       // eslint-disable-next-line no-restricted-globals
  //       location.reload();
  //     }

  //     setAuthenticated(authenticated);
  //   };

  //   authenticate(localStorage.password);
  // }, []);

  return <>{children}</>;
};

export default AuthenticationLayer;
