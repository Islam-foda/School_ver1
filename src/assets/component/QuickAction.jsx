import React from 'react';
import { Users, BookOpen, Calendar, FileText } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { label: 'إضافة طالب جديد', icon: Users, color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'إضافة دورة جديدة', icon: BookOpen, color: 'bg-green-600 hover:bg-green-700' },
    { label: 'الجدول الدراسي', icon: Calendar, color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'التقارير', icon: FileText, color: 'bg-orange-600 hover:bg-orange-700' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">الوصول السريع</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`${action.color} text-white p-4 rounded-lg transition-colors flex items-center space-x-3`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;