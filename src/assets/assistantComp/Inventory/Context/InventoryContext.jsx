// FILEPATH: d:/FrontEnd/School_ver1/src/assets/assistantComp/Inventory/Context/InventoryContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { inventoryService } from './InventoryService';

// Create the context
const InventoryContext = createContext();

// Inventory Provider Component with Firestore integration
const InventoryProvider = ({ children }) => {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Group items by category
  const inventoryData = React.useMemo(() => {
    const grouped = {
      electronics: [],
      labs: [],
      furniture: [],
      documents: [],
      consumables: [],
      activities: []
    };

    allItems.forEach(item => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      }
    });

    return grouped;
  }, [allItems]);

  const totalItems = allItems.length;

  // Subscribe to Firestore changes
  useEffect(() => {
    const unsubscribe = inventoryService.subscribeToInventory((items, error) => {
      if (error) {
        setError('فشل في تحميل البيانات');
        setLoading(false);
        return;
      }

      if (items) {
        setAllItems(items);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Add item to Firestore
  const addItem = async (category, itemData) => {
    try {
      setError(null);
      await inventoryService.addItem({
        ...itemData,
        category,
        quantity: parseInt(itemData.quantity)
      });
    } catch (error) {
      setError('فشل في إضافة العنصر');
      throw error;
    }
  };

  // Update item in Firestore
  const updateItem = async (id, itemData) => {
    try {
      setError(null);
      await inventoryService.updateItem(id, itemData);
    } catch (error) {
      setError('فشل في تحديث العنصر');
      throw error;
    }
  };

  // Delete item from Firestore
  const deleteItem = async (id) => {
    try {
      setError(null);
      await inventoryService.deleteItem(id);
    } catch (error) {
      setError('فشل في حذف العنصر');
      throw error;
    }
  };

  return (
    <InventoryContext.Provider value={{
      inventoryData,
      totalItems,
      loading,
      error,
      addItem,
      updateItem,
      deleteItem
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryProvider, InventoryContext };