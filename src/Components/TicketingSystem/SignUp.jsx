import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './SignUp.css';
import tikiIcon from '../Assets/icon-tiki.png';
import emailIcon from '../Assets/icons8-email-24.png';
import passwordIcon from '../Assets/icons8-password-26.png';
import usernameIcon from '../Assets/icons8-user-30.png';
import phoneIcon from '../Assets/icons8-phone-30.png';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();  

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5267/api/Auth/register', {
                username,
                email,
                password,
                confirmPassword,
                phone
            });

            
            if (response.status === 200 || response.status === 201) { 
                alert('User registered successfully');
                navigate('/'); 
            } else {
                alert(`Registration failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('There was an error registering the user!', error);
            alert('Error occurred during registration. Please try again.');
        }
    };

    return (
        <div className="container-signup">
            <div className="welcome-signup">
                <img src={tikiIcon} alt="TIKI icon" />
                <div>Welcome to <span className="tiki-signup">TIKI</span></div>
            </div>
            <div className="header-signup">
                <div className="text-signup">Sign Up</div>
                <div className="underline-signup"></div>
            </div>
            <div className="inputs-signup">
                <img src={usernameIcon} alt="Username icon" />
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
            </div>
            <div className="inputs-signup">
                <img src={emailIcon} alt="Email icon" />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            </div>
            <div className="inputs-signup">
                <img src={passwordIcon} alt="Password icon" />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>
            <div className="inputs-signup">
                <img src={passwordIcon} alt="Password icon" />
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                />
            </div>
            <div className="inputs-signup">
                <img src={phoneIcon} alt="phone icon" />
                <input 
                    type="text" 
                    placeholder="Phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                />
            </div>
            <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
            <div className="signup-link">
                Already have an account? <Link to="/">Login</Link>
            </div>
        </div>
    );
}

export default SignUp;
