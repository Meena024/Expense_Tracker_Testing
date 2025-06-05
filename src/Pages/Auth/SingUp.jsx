import { useState } from 'react';
import classes from './AuthForm.module.css';
import singUp from '../../Firebase/authFun';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUid } from '../../Store/authSlice';

export default function SingUp() {

    const [message, setMessage] = useState("");
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const dispatch = useDispatch();
    const handleSubmit = async (event) => {
        event.preventDefault();

        const email = event.target.email.value
        const password = event.target.password.value
        const passwordConfirmation = event.target.confirmPassword.value

        if (password !== passwordConfirmation) {
            alert("Passwords do not match");
            return;
        }

        try {
            // Sign up logic
            setMessage("Sending request...");

            const userUid = await singUp(email, password)
            dispatch(setUid(userUid));

            setIsAuthenticate(true)
        } catch (error) {
            console.error(error);
            alert(error.message)
        }

        setMessage("");
        event.target.reset();

        console.log("User has successfully signed up!");
    }


    return (
        <>
            <section className={classes.auth}>
                <h1>Sign Up</h1>

                <form onSubmit={handleSubmit}>
                    <div className={classes.control}>
                        <input type='email' name="email" id='email' placeholder='Email' required />
                    </div>
                    <div className={classes.control}>
                        <input
                            type='password'
                            name="password"
                            id='password'
                            placeholder='Password'
                            required
                        />
                    </div>
                    <div className={classes.control}>
                        <input
                            type='password'
                            name="confirmPassword"
                            id='confirmPassword'
                            placeholder='Confirm Password'
                            required
                        />
                    </div>
                    {message.length > 0 ?
                        <p>{message}</p>
                        :
                        <div className={classes.actions}>
                            <button type='submit'>Sign Up</button>
                        </div>
                    }
                </form>

            </section>
            <section className={classes.auth}>
                <Link to="/login">
                Have an account? Login
                </Link>
            </section>

            {isAuthenticate && <Navigate to='/login' />}
        </>
    )
}
