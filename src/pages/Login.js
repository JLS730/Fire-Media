import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { auth } from '../scripts/firebase'; 
import { signInWithEmailAndPassword, signInAnonymously, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth"

import '../styles/login.css';

const Login = () => {
    useEffect(() => {
        handleLoggedIn()
    }, [])

    const loginAndSignupModalRef = useRef(null)

    const createAccountSubmitRef = useRef(null)
    const loginAccountSubmitRef = useRef(null)

    const accountUsernameTextRef = useRef(null)

    const selectLoginModalRef = useRef(null)
    const selectSignupModalRef = useRef(null)

    const usernameContainerRef = useRef(null)
    const passwordConfirmContainerRef = useRef(null)

    const emailRef = useRef(null)
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const passwordConfirmRef = useRef(null)

    const navigate = useNavigate()

    function handleCreateAccountButton() {
        if(loginAndSignupModalRef.current.classList.contains('hidden')) {
            loginAndSignupModalRef.current.classList.remove('hidden')
            createAccountSubmitRef.current.classList.remove('hidden')
            loginAccountSubmitRef.current.classList.add('hidden')
            passwordConfirmContainerRef.current.classList.remove('hidden')
            usernameContainerRef.current.classList.remove('hidden')
            selectLoginModalRef.current.classList.remove('open')
            selectSignupModalRef.current.classList.add('open')
    
            emailRef.current.value = ''
            usernameRef.current.value = ''
            passwordRef.current.value = ''
            passwordConfirmRef.current.value = ''
        }
    }
    
    function handleLoginButton() {
        onAuthStateChanged(auth, user => {
            if(user) {
                navigate('/redirect')
            } else {
                loginAndSignupModalRef.current.classList.remove('hidden')
                loginAccountSubmitRef.current.classList.remove('hidden')
                createAccountSubmitRef.current.classList.add('hidden')
                passwordConfirmContainerRef.current.classList.add('hidden')
                usernameContainerRef.current.classList.add('hidden')
                selectSignupModalRef.current.classList.remove('open')
                selectLoginModalRef.current.classList.add('open')
    
                emailRef.current.value = ''
                usernameRef.current.value = ''
                passwordRef.current.value = ''
                passwordConfirmRef.current.value = ''
            }
        })
    }

    function handleSignUpSelect() {
        createAccountSubmitRef.current.classList.remove('hidden')
        loginAccountSubmitRef.current.classList.add('hidden')
        passwordConfirmContainerRef.current.classList.remove('hidden')
        usernameContainerRef.current.classList.remove('hidden')
        selectSignupModalRef.current.classList.add('open')
        selectLoginModalRef.current.classList.remove('open')
    }
    
    function handleLoginSelect() {
        createAccountSubmitRef.current.classList.add('hidden')
        loginAccountSubmitRef.current.classList.remove('hidden')
        passwordConfirmContainerRef.current.classList.add('hidden')
        usernameContainerRef.current.classList.add('hidden')
        selectLoginModalRef.current.classList.add('open')
        selectSignupModalRef.current.classList.remove('open')
    }

    function handleModalCloseButton() {
        if(!loginAndSignupModalRef.current.classList.contains('hidden')) {
            loginAndSignupModalRef.current.classList.add('hidden')
        }
    }

    function handleLoggedIn() {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                accountUsernameTextRef.current.textContent = user.displayName
            }
        })
    }

    function handleAccountFormValidation() {
        if(emailRef.current.value === '') {
            emailRef.current.style.border = '2px solid red'
        } else {
            emailRef.current.style.border = '2px solid black'
        }
        
        if(usernameRef.current.value === '') {
            usernameRef.current.style.border = '2px solid red'
        } else {
            usernameRef.current.style.border = '2px solid black'
        }
        
        if(passwordRef.current.value === '') {
            passwordRef.current.style.border = '2px solid red'
        } else {
            passwordRef.current.style.border = '2px solid black'
        }
        
        if(passwordConfirmRef.current.value === '') {
            passwordConfirmRef.current.style.border = '2px solid red'
        } else {
            passwordConfirmRef.current.style.border = '2px solid black'
        }
    }

    function handleLoginFormValidation() {
        emailRef.current.style.border = '2px solid red'
        passwordRef.current.style.border = '2px solid red'
    }

    function handleAnonymousLogin() {
        signInAnonymously(auth).then(() => {
            console.log('logged in')
            
            navigate('/redirect')
        }).catch( error => {
            console.log(error.message)
        })
    }

    function handleEmailLogin() {
        signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value).then((userCredentials) => {
            navigate('/redirect')
        }).catch((error) => {
            handleLoginFormValidation()
            console.log(error)
        })
    }

    function handleCreateAccount() {
        if(emailRef.current.value === '' || usernameRef.current.value === '' || passwordRef.current.value === '' || passwordConfirmRef.current.value === '' || !passwordConfirmRef.current.value === passwordRef.current.value) {
            handleAccountFormValidation()
            console.log('Incorrect')
        } else {
            createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value).then((userCredentials) => {
                console.log(userCredentials.user)
            }).then(() => {
                updateProfile(auth.currentUser, {
                    displayName: usernameRef.current.value
                }).then(() => {
                    console.log('Update Successful')
                }).catch(() => {
                    console.log('Update Failed')
                })
            }).catch((error) => {
                console.log(error)
            })
        
            navigate('/redirect')
    
            console.log('confirm')
        }
    }

    return (
        <React.Fragment>
            <aside className="login-signup-section hidden" ref={loginAndSignupModalRef}>
                <i className="far fa-window-close close-button" onClick={() => handleModalCloseButton()}></i>
                <div className="login-signup-container">
                    <div className="login-signup-select">
                        <span className="login" ref={selectLoginModalRef} onClick={() => handleLoginSelect()}>Login</span>
                        <span className="signup" ref={selectSignupModalRef} onClick={() => handleSignUpSelect()}>Sign-up</span>
                    </div>
                    <div className="create-account-info">
                        <div className="email-container info-containers">
                            <label htmlFor="email">Email: </label>
                            <input type="text" className="email-input" ref={emailRef}/>
                        </div>
                        <div className="username-container info-containers hidden" ref={usernameContainerRef}>
                            <label htmlFor="username">Username: </label>
                            <input type="text" className="username-input" ref={usernameRef}/>
                        </div>
                        <div className="password-container info-containers">
                            <label htmlFor="password">Password: </label>
                            <input type="password" className="password-input" ref={passwordRef}/>
                        </div>
                        <div className="password-confirm-container info-containers hidden" ref={passwordConfirmContainerRef}>
                            <label htmlFor="password-confirm">Confirm Password: </label>
                            <input type="password" className="password-confirm-input" ref={passwordConfirmRef}/>
                        </div>
                    </div>
                    <div className="create-account-container">
                        <button className="create-account-submit" ref={createAccountSubmitRef} onClick={() => handleCreateAccount()}>Create Account</button>
                        <button className="login-account-submit" ref={loginAccountSubmitRef} onClick={() => handleEmailLogin()}>Login</button>
                    </div>
                </div>
            </aside>

            <section className="login-section">
                <div className="background-tint"></div>
                <div className="login-container">
                    <div className="login-header">
                        <span className="login-header-text">Login To An Account</span>
                    </div>
                    <div className="accounts-container">
                        <div className="account-containers account-selection-1" onClick={() => handleLoginButton()}>
                            <span className="account-1-username account-username" ref={accountUsernameTextRef}>Login</span>
                        </div>
                        <div className="account-containers account-selection-2" onClick={() => handleAnonymousLogin()}>
                            <span className="account-2-username account-username">Demo Login</span>
                        </div>
                        {/* <div className="account-containers account-selection-3">
                            <span className="account-3-username account-username">Admin</span>
                        </div> */}
                        <div className="account-containers account-selection-4" onClick={() => handleCreateAccountButton()}>
                            <span className="account-4-username account-username">Create An Account</span>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
};

export default Login;