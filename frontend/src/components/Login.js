import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Import the context

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 91vh;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 380px; /* Maximum width of form */
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #333;
`;

const Info = styled.h2`
  color: #666;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #007bff;
    background-color: #fff;
  }
`;

const Button = styled.button`
  background-color: #333;
  margin: 0;

  &:hover {
    background-color: black;
  }
`;

const Error = styled.p`
  color: red;
  margin-top: 10px;
  text-align: center;
`;

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To store and display error messages
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    // Check if username or password is empty
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      await login(username, password); // Call the login function
      navigate('/job-applications'); // Redirect after successful login
    } catch (error) {
      setError(error.message); // Set the error message
    }
  };

  return (
      <Container>
        <FormWrapper>
          <Title>Let the hunt begin.</Title>
          <Info>Log in to your ATSFS account.</Info>
          <form onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit">Login</Button>
            {error && <Error>{error}</Error>} {/* Display error message */}
          </form>
        </FormWrapper>
      </Container>
  );
};

export default Login;
