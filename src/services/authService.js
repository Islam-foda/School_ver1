import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User signed in:", user.email);
    return userCredential;
  } catch (error) {
    console.error("Error signing in:", error.code, error.message);
    throw error;
  }
}

// Example usage:
// signInUser("existinguser@example.com", "theirpassword");

export function signUpUser(email, password) {
  createUserWithEmailAndPassword(email, password)
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

export async function signOutUser() {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Example usage:
// signOutUser();
