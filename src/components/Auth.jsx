import React, { useState } from 'react'
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup.jpg';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: ''
}

const Auth = () => {

    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);

    // e is an event with the text of the input
    const handleChange = (e) => {
        // spread the form and add target name as key and target value as its respective value
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
    }

    const handleSubmit = async (e) => {
        // prevent from reloading the page
        e.preventDefault();

        // get data from the form
        const { fullName, username, password, phoneNumber, avatarURL} = form;

        //get url of server
        const URL = 'http://localhost:5000/auth';

        // request to the backend
        const {data : {token, userId, hashedPassword}} = await axios.post(`${URL}/${isSignup ? 'signup':'login'}`, {
            username, password, fullName, phoneNumber, avatarURL
        })

        // get data back from the backend 
        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('fullName', fullName);
        cookies.set('userId', userId);

        if(isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword)
        }

        // reload app to have a filled token so that we go to our chat
        window.location.reload();
        // console.log(form);
    }

    return (
        <div className='auth__form-container'>
            <div className='auth__form-container_fields'>
                <div className='auth__form-container_fields-content'>
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {
                            isSignup && (
                                <div className='auth__form-container_fields-content_input'>
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        name='fullName'
                                        placeholder='Full Name'
                                        onChange={handleChange}
                                        type="text"
                                        required
                                    />
                                </div>
                            )
                        }
                        {/* username is required for sign in as well as signup */}
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor="username">Username</label>
                            <input
                                name='username'
                                placeholder='Username'
                                onChange={handleChange}
                                type="text"
                                required
                            />
                        </div>
                        {
                            isSignup && (
                                <div className='auth__form-container_fields-content_input'>
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input
                                        name='phoneNumber'
                                        placeholder='Phone Number'
                                        onChange={handleChange}
                                        type="text"
                                        required
                                    />
                                </div>
                            )
                        }
                        {
                            isSignup && (
                                <div className='auth__form-container_fields-content_input'>
                                    <label htmlFor="avatarURL">Avatar URL</label>
                                    <input
                                        name='avatarURL'
                                        placeholder='Avatar URL'
                                        onChange={handleChange}
                                        type="text"
                                        required
                                    />
                                </div>
                            )
                        }
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor="password">Password</label>
                            <input
                                name='password'
                                placeholder='Password'
                                onChange={handleChange}
                                type="password"
                                required
                            />
                        </div>
                        {
                            isSignup && (
                                <div className='auth__form-container_fields-content_input'>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        name='confirmPassword'
                                        placeholder='Confirm Password'
                                        onChange={handleChange}
                                        type="password"
                                        required
                                    />
                                </div>
                            )
                        }
                        <div className='auth__form-container_fields-content_button'>
                            <button>
                                {isSignup ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                    <div className='auth__form-container_fields-account'>
                        <p>
                            {isSignup ?
                                "Already have an account?" : "Don't have an account?"}
                            <span onClick={switchMode}>
                                {isSignup ? ' Sign In' : ' Sign Up'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className='auth__form-container_image'>
                <img src={signinImage} alt="Sign In" />
            </div>
        </div>
    )
}

export default Auth
