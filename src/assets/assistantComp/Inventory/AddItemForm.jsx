import { useState } from 'react';
import { useInventory } from './Context/useInventory';
import {
  Monitor,
  FlaskConical,
  Armchair,
  FileText,
  TrendingDown,
  Calendar,
  Save,
  X,
  Loader2
} from 'lucide-react';

const AddItemForm = ({ onSave, onCancel }) => {
  const { addItem } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    location: '',
    category: 'electronics',
    description: '',
    supplier: '',
    purchaseDate: '',
    price: '',
    condition: 'new'
  });

  const categories = [
    {
      value: 'electronics',
      label: 'أجهزة الكترونية',
      labelEn: 'Electronic Devices',
      icon: Monitor,
      color: 'text-blue-600'
    },
    {
      value: 'labs',
      label: 'معامل',
      labelEn: 'Laboratory Equipment',
      icon: FlaskConical,
      color: 'text-green-600'
    },
    {
      value: 'furniture',
      label: 'اثاث',
      labelEn: 'Furniture',
      icon: Armchair,
      color: 'text-purple-600'
    },
    {
      value: 'documents',
      label: 'اوراق وسجلات',
      labelEn: 'Documents & Records',
      icon: FileText,
      color: 'text-yellow-600'
    },
    {
      value: 'consumables',
      label: 'استهلاك',
      labelEn: 'Consumables',
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      value: 'activities',
      label: 'انشطة',
      labelEn: 'Activities',
      icon: Calendar,
      color: 'text-indigo-600'
    }
  ];

  const conditions = [
    { value: 'new', label: 'جديد', labelEn: 'New' },
    { value: 'excellent', label: 'ممتاز', labelEn: 'Excellent' },
    { value: 'good', label: 'جيد', labelEn: 'Good' },
    { value: 'fair', label: 'مقبول', labelEn: 'Fair' },
    { value: 'poor', label: 'سيء', labelEn: 'Poor' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.quantity) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);
      await addItem(formData.category, formData);

      // Reset form
      setFormData({
        name: '',
        quantity: '',
        location: '',
        category: 'electronics',
        description: '',
        supplier: '',
        purchaseDate: '',
        price: '',
        condition: 'new'
      });

      if (onSave) onSave();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('حدث خطأ أثناء إضافة العنصر');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {selectedCategory && (
            <>
              <selectedCategory.icon className={`w-8 h-8 ${selectedCategory.color}`} />
              <div>
                <h2 className="text-xl font-bold mr-2 text-gray-800">إضافة عنصر جديد</h2>
                <p className="text-sm mr-2 text-gray-500">{selectedCategory.label}</p>
              </div>
            </>
          )}
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
           التصنيفات
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                  className={`p-4 border-2 rounded-lg transition-all ${formData.category === category.value
                      ? `border-${category.color.split('-')[1]}-500 bg-${category.color.split('-')[1]}-50`
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <IconComponent className={`w-6 h-6 ${category.color}`} />
                    <div className="text-center">
                      <div className="text-sm font-medium">{category.label}</div>
                      <div className="text-xs text-gray-500">{category.labelEn}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم العنصر * 
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="أدخل اسم العنصر"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الكمية * 
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الموقع 
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="مثال: المكتبة، المعمل، الفصل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة 
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label} - {condition.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المورد 
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="اسم المورد"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الشراء
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السعر 
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف 
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            placeholder="وصف تفصيلي للعنصر..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            إلغاء 
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.quantity}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="mr-2">حفظ العنصر</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;