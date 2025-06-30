import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword, } from "firebase/auth";
import { signOut } from "firebase/auth";

// ... (your firebase initialization code from above) ...

export function signInUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log("User signed in:", user.email);
      // Redirect to a dashboard or main app page
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorCode, errorMessage);
      // Handle errors, e.g., "invalid-email", "user-not-found", "wrong-password"
    });
}

// Example usage:
// signInUser("existinguser@example.com", "theirpassword");


export function signUpUser(email, password) {
  createUserWithEmailAndPassword( email, password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      console.log("User signed up:", user.email);
      // You can now do things like store user data in Firestore
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing up:", errorCode, errorMessage);
      // Handle errors, e.g., display a message to the user
    });
}

export function signOutUser() {
  signOut().then(() => {
    // Sign-out successful.
    console.log("User signed out.");
    // Update UI, redirect to login page
  }).catch((error) => {
    // An error happened.
    console.error("Error signing out:", error);
  });
}

// Example usage:
// signOutUser();