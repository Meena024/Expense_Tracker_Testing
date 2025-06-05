import { useState } from 'react';
import { forgotPassword } from '../../Firebase/authFun';
import classes from './AuthForm.module.css';
import { Link, Navigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const message = await forgotPassword(email);
      alert(message);
      setIsAuthenticate(true)
    } catch (error) {
      alert(error.message);
    }

  };

  return (
    <section className={classes.auth}>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <input type='email' name="email" id='email' placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
        </div>
        <div className={classes.actions}>
          <button type="submit">Send Reset Link</button>
        </div>
      </form>


      <section className={classes.auth}>
        <Link to="/sing-up">
          Don&#39;t have an account? Sing up
        </Link>
      </section>

      {isAuthenticate && <Navigate to='/login' />}

    </section>
  );
}
