import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../api/api";
import '../styles/register.css';

const Register = () => {
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');

    if (!full_name) {
      setNameError('Full Name is required!');
      return;
    }
    if (!email) {
      setEmailError('Email is required!');
      return;
    }
    if (!password) {
      setPasswordError('Password is required!');
      return;
    }

    try {
      await registerUser({ full_name, email, password });
      localStorage.setItem('user', JSON.stringify({ full_name }));
      navigate("/login");
      alert('Successfully Registered!');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Welcome to #1 Book-Reviews Website</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={full_name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="error-message">{nameError}</div>
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="error-message">{emailError}</div>
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error-message">{passwordError}</div>
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary register-button">
              Create my Account!
            </button>
          </div>
        </form>
        <div className="register-link">
          <span>Already have one?</span>
          <a href="/login"> Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
