import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
  // fetchSignInMethodsForEmail,
} from "firebase/auth";

import firebaseApp from "./initialize";

const auth = getAuth(firebaseApp);

export async function checkTokenValidity(callback) {
  const user = auth.currentUser;
  if (user) {
    const idTokenResult = await user.getIdTokenResult();
    const isExpired =
      new Date().getTime() / 1000 > idTokenResult.expirationTime;

    callback(isExpired);
  }

  return false;
}

// Signed up
export default async function singUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);
    console.log("Verification email sent!");

    return user.uid;
  } catch (error) {
    const errorMessage = error.message;
    console.log(errorMessage);
    throw new Error("Email Exceed");
  }
}

// Signed in (Login)
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      throw new Error("Email is not verified. Please check your email.");
    }

    return user.uid;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Logout
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw new Error("Logout failed");
  }
}

// get password reset link on email
export async function forgotPassword(email) {
  try {
    // const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    // if (signInMethods.length === 0) {
    //   throw new Error("No user found with this email.");
    // }

    await sendPasswordResetEmail(auth, email);
    const message = "Password reset link is sent to mail: " + email;
    return message;
  } catch (error) {
    console.error("Error sending password reset email", error.message);
    throw new Error(error.message);
  }
}

// Update Profile

export async function updateUserProfile(name, photoURL) {
  try {
    const response = await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });

    console.log("Profile updated!");
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating profile");
  }
}

// Get user Profile data

export function getUserProfile() {
  try {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userProfile = user.providerData[0];
          resolve(userProfile);
        } else {
          reject(new Error("User not logged in."));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error getting user profile");
  }
}
