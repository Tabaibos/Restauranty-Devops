import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { MdEmail } from "react-icons/md"
import { FaLock, FaCircleUser, FaRegCircleUser, FaLocationDot, FaPhoneFlip } from "react-icons/fa6"

function SignupPage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleSurname = (e) => setSurname(e.target.value);
  const handleAddress = (e) => setAddress(e.target.value);
  const handlephoneNumber = (e) => setphoneNumber(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (name === '' || surname === '' || email === '' || password === '' || address === '' || phoneNumber === '') {
      setErrorMessage('All fields are required');
      return;
    } else {
      const requestBody = { name, surname, email, password, address, phoneNumber };
      authService
        .signup(requestBody)
        .then((response) => {
          navigate("/login");
        })
        .catch((error) => {
          console.log(error)
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        });
    }
  };

  return (
    <div className="MainSignup">
      <div className="SignupPage">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join Restauranty and start managing your menu</p>
        </div>

        <form onSubmit={handleSignupSubmit}>
          <div className="inputwrap">
            <div className="grid grid-cols-2 gap-3 mt-2 mb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <FaCircleUser className="w-[1rem] h-[1rem] text-gray-400" />
                </div>
                <input className="input-forms" type="text" name="name" placeholder="First Name" value={name} onChange={handleName} />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <FaRegCircleUser className="w-[1rem] h-[1rem] text-gray-400" />
                </div>
                <input className="input-forms" type="text" name="surname" placeholder="Last Name" value={surname} onChange={handleSurname} />
              </div>
            </div>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <MdEmail className="w-[1.1rem] h-[1.1rem] text-gray-400" />
              </div>
              <input className="input-forms" type="email" name="email" placeholder="Email address" value={email} onChange={handleEmail} />
            </div>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <FaLocationDot className="w-[1rem] h-[1rem] text-gray-400" />
              </div>
              <input className="input-forms" type="text" name="address" placeholder="Address" value={address} onChange={handleAddress} />
            </div>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <FaPhoneFlip className="w-[1rem] h-[1rem] text-gray-400" />
              </div>
              <input className="input-forms" type="text" name="phoneNumber" placeholder="Phone Number" value={phoneNumber} onChange={handlephoneNumber} />
            </div>
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <FaLock className="w-[1rem] h-[1rem] text-gray-400" />
              </div>
              <input
                className="input-forms"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="button w-full" type="submit">Create Account</button>

            <p className="text-gray-500 text-sm mt-2">Already have an account?</p>
            <Link to={"/login"}><p className="sign-up-link text-sm mt-1">Sign in</p></Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
