import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from "../api/api";
import '../styles/login.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = async () => {
    try {
      const data = await loginUser({ email, password });

      if (data && data.user_id) {  
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("login_time", new Date().toISOString());
        alert("Succesfully Logged in!");
        setIsAuthenticated(true);  
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('Wrong credentials, Please try again.');
    }
  };
  


  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Welcome back!</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          type="email"
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
          required
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          type="password"
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
          required
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
      <br />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <span>Don't you have an account? </span>
        <Link to="/register" className="link">Register here!</Link>
      </div>
    </div>
  );
};

export default Login;