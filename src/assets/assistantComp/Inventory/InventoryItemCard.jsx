import { useState } from 'react';
import {
  Edit,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import PermissionGuard from '../../../components/PermissionGuard';

const InventoryItemCard = ({ item, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new':
        return 'text-green-600 bg-green-100';
      case 'excellent':
        return 'text-blue-600 bg-blue-100';
      case 'good':
        return 'text-yellow-600 bg-yellow-100';
      case 'fair':
        return 'text-orange-600 bg-orange-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionLabel = (condition) => {
    switch (condition) {
      case 'new':
        return 'جديد';
      case 'excellent':
        return 'ممتاز';
      case 'good':
        return 'جيد';
      case 'fair':
        return 'مقبول';
      case 'poor':
        return 'سيء';
      default:
        return condition;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    } catch {
      return 'غير محدد';
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'غير محدد';
    return `${parseFloat(price).toFixed(2)} جنيه`;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-gray-500">الكمية:</span>
            <span className="text-sm font-medium text-blue-600">{item.quantity}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex space-x-2 rtl:space-x-reverse transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <PermissionGuard permission="edit-inventory">
            <button
              onClick={() => onEdit(item)}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
          </PermissionGuard>
          <PermissionGuard permission="delete-inventory">
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Condition Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
          {getConditionLabel(item.condition)}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-2 text-sm">
        {item.location && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
            <MapPin size={14} className="text-gray-400" />
            <span>{item.location}</span>
          </div>
        )}

        {item.supplier && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
            <User size={14} className="text-gray-400" />
            <span>{item.supplier}</span>
          </div>
        )}

        {item.purchaseDate && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
            <Calendar size={14} className="text-gray-400" />
            <span>{formatDate(item.purchaseDate)}</span>
          </div>
        )}

        {item.price && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
            <DollarSign size={14} className="text-gray-400" />
            <span>{formatPrice(item.price)}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>تم الإضافة: {formatDate(item.dateAdded)}</span>
        {item.updatedAt && (
          <span>آخر تحديث: {formatDate(item.updatedAt)}</span>
        )}
      </div>
    </div>
  );
};

export default InventoryItemCard;