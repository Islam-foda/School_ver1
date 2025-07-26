import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { signInUser, signOutUser } from '../services/authService';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from Firestore
  const fetchUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().role || 'user';
      }
      return 'user'; // Default role
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  };

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const role = await fetchUserRole(user.uid);
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      await signInUser(email, password);
      return { success: true };
    } catch (error) {
      console.log(error.message)
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOutUser();
      return { success: true };
    } catch (error) {
      console.log(error)
      return { success: false, error: 'كلمة المرور غير صحيحة' };
    }
  };

  // Check if user has admin permissions
  const isAdmin = () => userRole === 'admin';

  // Check if user has specific permissions
  const hasPermission = (permission) => {
    if (userRole === 'admin') return true;

    const userPermissions = {
      'view-students': true,
      'view-staff': true,
      'view-classes': true,
      'view-inventory': true,
      // User role: no edit or delete permissions
      'edit-students': false,
      'delete-students': false,
      'edit-staff': false,
      'delete-staff': false,
      'edit-classes': false,
      'delete-classes': false,
      'edit-inventory': false,
      'delete-inventory': false,
    };

    return userPermissions[permission] || false;
  };

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    logout,
    isAdmin,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 