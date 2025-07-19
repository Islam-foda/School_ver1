/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useInventory } from './Context/useInventory';
import AddItemForm from './AddItemForm';
import InventoryItemCard from './InventoryItemCard';
import { Loader2, AlertCircle } from "lucide-react";



const InventoryCategory = ({
  category,
  title,
  titleAr,
  icon: Icon,
  color,
  onEditItem
}) => {
  const { inventoryData, addItem, deleteItem, loading, error } = useInventory();
  const [newItem, setNewItem] = useState({ name: '', quantity: '', location: '' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const items = inventoryData[category] || [];

  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity) {
      try {
        setIsAdding(true);
        await addItem(category, newItem);
        setNewItem({ name: '', quantity: '', location: '' });
      } catch (error) {
        // Error handled in context
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      try {
        await deleteItem(id);
      } catch (error) {
        // Error handled in context
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${color} p-6 hover:shadow-lg transition-shadow`}>
      {/* Category Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
          <div>
            <h3 className="text-lg font-bold text-gray-800">{titleAr}</h3>
            <p className="text-sm text-gray-500 font-arabic">{title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${color.replace('border-', 'bg-').replace('500', '100')} ${color.replace('border-', 'text-')}`}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${items.length} عنصر`}
          </span>
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 space-y-4">
          {/* Add New Item Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-700 mb-3">إضافة عنصر جديد</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="اسم العنصر"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                disabled={isAdding}
              />
              <input
                type="number"
                placeholder="الكمية"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                disabled={isAdding}
              />
              <input
                type="text"
                placeholder="الموقع"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                disabled={isAdding}
              />
            </div>
            <button
              onClick={handleAddItem}
              disabled={isAdding || !newItem.name || !newItem.quantity}
              className={`mt-3 px-4 py-2 ${color.replace('border-', 'bg-')} text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse`}
            >
              {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>إضافة</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">جاري التحميل...</span>
            </div>
          )}

          {/* Items List */}
          {!loading && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onEdit={onEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          ) : !loading && (
            <p className="text-gray-500 text-center py-4">لا توجد عناصر في هذه الفئة</p>
          )}
        </div>
      )}
    </div>
  );
};

// // Error Alert Component
// export const ErrorAlert = ({ error, onClose }) => (
//   <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//     <div className="flex items-center">
//       <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
//       <span className="text-red-700 font-medium">{error}</span>
//       <button
//         onClick={onClose}
//         className="mr-auto text-red-500 hover:text-red-700"
//       >
//         ×
//       </button>
//     </div>
//   </div>
// );

export default InventoryCategory;
