import React from 'react';
import './ForgotPassword.css';
import emailIcon from '../Assets/icons8-email-24.png';

function ForgotPassword() {
    return (
        <div className="container-forgetpassword">
            <div className="header-forgetpassword">
                <div className="text-forgetpassword">Forget Password</div>
                <div className="underline-forgetpassword"></div>
            </div>
            <div className="inputs-forgetpassword">
                <img src={emailIcon} alt="Email icon" />
                <input type="email" placeholder="Enter your email" required />
            </div>
            <button className="forgetpassword-button">Send Reset Link</button>
        </div>
    );
}

export default ForgotPassword;
