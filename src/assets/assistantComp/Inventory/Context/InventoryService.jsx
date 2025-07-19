import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../../services/firebaseConfig';

// Firestore service functions
const inventoryService = {
  // Subscribe to all inventory items
  subscribeToInventory: (callback) => {
    const unsubscribe = onSnapshot(
      collection(db, 'inventory'),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(items, null);  // Pass null as error when successful
      },
      (error) => {
        console.error('Error fetching inventory:', error);
        callback(null, error);
      }
    );
    return unsubscribe;
  },

  // Add new inventory item
  addItem: async (itemData) => {
    try {
      const docRef = await addDoc(collection(db, 'inventory'), {
        ...itemData,
        dateAdded: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  // Update inventory item
  updateItem: async (id, itemData) => {
    try {
      await updateDoc(doc(db, 'inventory', id), {
        ...itemData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete inventory item
  deleteItem: async (id) => {
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};

export { inventoryService };