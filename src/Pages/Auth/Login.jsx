import { useState } from "react";
import classes from "./AuthForm.module.css";
import { signIn } from "../../Firebase/authFun";
import { Link, Navigate } from "react-router-dom";
import { setUid } from "../../Store/authSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const [message, setMessage] = useState("");
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      setMessage("Sending request...");
      const userUid = await signIn(email, password);
      dispatch(setUid(userUid));
      setIsAuthenticate(true);
      event.target.reset();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }

    setMessage("");
  };

  return (
    <>
      <section className={classes.auth}>
        <h1>Login</h1>

        <form onSubmit={handleSubmit} data-testid="login-form">
          <div className={classes.control}>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
            />
          </div>
          <div className={classes.control}>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>

          <Link to="/forgot-password">Forgot Password</Link>

          {message.length > 0 ? (
            <p>{message}</p>
          ) : (
            <div className={classes.actions}>
              <button type="submit">Sign Up</button>
            </div>
          )}
        </form>
      </section>

      <section className={classes.auth}>
        <Link to="/sing-up">Don&#39;t have an account? Sing up</Link>
      </section>

      {isAuthenticate && <Navigate to="/" />}
    </>
  );
}
