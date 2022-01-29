import React, { useEffect } from 'react';

import { useNavigate } from 'react-router';

import '../styles/redirect.css'

const Redirect = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/homepage')
    }, 500)
  }, [])

  return (
    <React.Fragment>
      <div className="sign-in-successful-container">
          <h1>Sign in Successful</h1>
      </div>
    </React.Fragment>
  )
};

export default Redirect;
