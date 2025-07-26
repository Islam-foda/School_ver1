import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Function to create a user and assign a role
export const createUserWithRole = async (email, password, role) => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store the user's role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role,
      createdAt: new Date(),
    });

    console.log(`User ${email} created successfully with role: ${role}`);
    return user;
  } catch (error) {
    console.error(`Error creating user ${email}:`, error);
    throw error;
  }
};

// Function to set up initial users (run this once)
export const setupInitialUsers = async () => {
  try {
    // Create admin user
    await createUserWithRole("admin@school.com", "admin123", "admin");

    // Create regular user
    await createUserWithRole("user@school.com", "user123", "user");

    console.log("Initial users created successfully!");
  } catch (error) {
    console.error("Error setting up initial users:", error);
  }
};

// Function to assign role to existing user
export const assignRoleToUser = async (uid, role) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        role: role,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    console.log(`Role ${role} assigned to user ${uid}`);
  } catch (error) {
    console.error("Error assigning role:", error);
    throw error;
  }
};
