import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { register as registerService } from '../services/authService'; // Import the register function from authService

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const FormWrapper = styled.div`
    width: 100%;
    max-width: 400px; /* Maximum width of form */
    padding: 0 20px;
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
    margin-bottom: 20px;
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
    background-color: black;
    margin: 0;

    &:hover {
        background-color: #333;
    }
`;

const Error = styled.p`
    color: red;
    margin-top: 10px;
    text-align: center;
`;

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        // Check if fields are empty
        if (!username || !email || !password) {
            setError("All fields are required.");
            return;
        }

        try {
            await registerService(username, email, password); // Call the register function
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data); // Set error message from response
            } else {
                setError('Registration failed. Please try again.'); // General error message
            }
        }
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Create your ATSFS account.</Title>
                <Info>Sign up to start tracking your applications.</Info>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">Register</Button>
                    {error && <Error>{error}</Error>}
                </form>
            </FormWrapper>
        </Container>
    );
};

export default Register;
