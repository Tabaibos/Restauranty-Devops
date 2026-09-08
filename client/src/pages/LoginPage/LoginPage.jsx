import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";
import { MdEmail } from "react-icons/md"
import { FaLock } from "react-icons/fa6"

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    authService
      .login(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="mainlogin">
      <div className="LoginPage">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to manage your restaurant</p>
        </div>

        <form id="form" onSubmit={handleLoginSubmit}>
          <div className="inputwrap">
            <div className="relative mt-2 mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <MdEmail className="w-[1.1rem] h-[1.1rem] text-gray-400" />
              </div>
              <input className="input-forms" type="email" name="email" placeholder="Email address" value={email} onChange={handleEmail} />
            </div>
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <FaLock className="w-[1rem] h-[1rem] text-gray-400" />
              </div>
              <input
                className="input-forms"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePassword}
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="button w-full" type="submit">Sign In</button>
            <p className="text-gray-500 text-sm mt-2">Don't have an account yet?</p>
            <Link to={"/signup"}><p className="sign-up-link text-sm mt-1">Create an account</p></Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
