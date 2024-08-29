import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios'; 
import tikiIcon from '../Assets/icon-tiki.png';
import emailIcon from '../Assets/icons8-email-24.png';
import passwordIcon from '../Assets/icons8-password-26.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5267/api/Auth/login', {
                email,
                password,
            });
    
            if (response.status === 200) {
                const result = response.data;
                
                // Fetch the user's name based on email
                const userResponse = await axios.get(`http://localhost:5267/api/User/email/${email}`, {
                    headers: { Authorization: `Bearer ${result.token}` }
                });
                
                const userName = userResponse.data.userName;

                // Store the token and user name in localStorage
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userName', userName);
                localStorage.setItem('email',email);

                navigate('/Dashboard');
            }
            alert('Login successfully');
        } catch (error) {
            if (error.response) {
                console.error('Login failed:', error.response.data.message);
                alert('Login failed: ' + error.response.data.message);
            } else {
                console.error('Axios error:', error.message);
                alert('An error occurred: ' + error.message);
            }
        }
    };

    return (
        <div className="container">
            <div className="welcome">
                <img src={tikiIcon} alt="TIKI icon" />
                <div>Welcome to <span className="tiki">TIKI</span></div>
            </div>
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <form onSubmit={handleLogin}>
                <div className="inputs">
                    <img src={emailIcon} alt="Email icon" />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="inputs">
                    <img src={passwordIcon} alt="Password icon" />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <Link to="/ForgotPassword" className="forgot-password">Forget Password?</Link>
                <button type="submit" className="login-button">Login</button>
            </form>
            <div className="signup-link">
                Don't have an account? <Link to="/SignUp">Sign Up</Link>
            </div>
        </div>
    );
}

export default Login;
