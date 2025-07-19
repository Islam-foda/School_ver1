import { 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const inventoryService = {
   subscribeToInventory: (callback) => {
    const unsubscribe = db.collection('inventory').onSnapshot(
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(items);
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
      const docRef = await mockFirestore.collection('inventory').add({
        ...itemData,
        dateAdded: new Date().toISOString(),
        createdAt: new Date().toISOString()
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
      await mockFirestore.collection('inventory').doc(id).update({
        ...itemData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete inventory item
  deleteItem: async (id) => {
    try {
      await mockFirestore.collection('inventory').doc(id).delete();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};