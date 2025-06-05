import { Link, Navigate } from "react-router-dom";
import classes from "./navbar.module.css";
import { logout } from "../../Firebase/authFun";
import { useState } from "react";
import { clearUid } from "../../Store/authSlice";
import { toggleDarkMode, buyPremium } from "../../Store/premiumSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const dispatch = useDispatch();
  const { totalAmount } = useSelector((state) => state.expenses);
  const { isDarkMode, isPremium } = useSelector((state) => state.premium);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleByPremium = () => {
    dispatch(buyPremium());
    alert("congratulations now you are a premium subscriber!");
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticate(true);
    dispatch(clearUid());
  };

  return (
    // <section className={isDarkMode && classes.darkMode}>
    <section className={isDarkMode ? classes.darkMode : undefined}>
      <div className={`${classes.hading} ${isDarkMode && classes.darkMode}`}>
        <p>Welcome To Expense Tracker!!!</p>

        <div className={classes.actions}>
          {totalAmount >= 10000 && !isPremium && (
            <button className={classes.btnPremium} onClick={handleByPremium}>
              Buy Premium
            </button>
          )}

          <div
            className={`${classes.profileAction} ${
              isDarkMode ? classes.darkMode : ""
            }`}
          >
            {/* <div
              className={`${classes.profileAction} ${
                isDarkMode && classes.darkMode
              }`}
            > */}
            Your profile is Incomplete. <Link to="/profile">Complete now</Link>
          </div>

          <button className={classes.logout} onClick={handleLogout}>
            Logout
          </button>
          {isPremium && (
            <button className={classes.toggleButton} onClick={handleToggle}>
              Toggle Dark Mode
            </button>
          )}
        </div>
      </div>
      <hr />
      {isAuthenticate && <Navigate to="/login" />}
    </section>
  );
}
