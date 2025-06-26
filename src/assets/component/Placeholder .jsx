import React from "react";
import {
  Users,
  BookOpen,
  Calendar,
  User,
  FileText,
  Settings,
} from "lucide-react";

const StudentsPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">شئون الطلاب</h2>
      <p className="text-gray-600">
        إدارة تسجيل الطلاب والملفات الشخصية والسجلات الأكاديمية.
      </p>
    </div>
  </div>
);

const CoursesPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <BookOpen className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">شئون العاملين</h2>
      <p className="text-gray-600">
        إنشاء وتحرير وإدارة العاملين والمناهج ومواد التعلم.
      </p>
    </div>
  </div>
);

const SchedulePage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <Calendar className="w-16 h-16 text-purple-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">الجدول الدراسي</h2>
      <p className="text-gray-600">
        تخطيط وتنظيم جداول الحصص والفعاليات والتقويم الأكاديمي.
      </p>
    </div>
  </div>
);

const ReportsPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <FileText className="w-16 h-16 text-orange-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">العهد والمخازن</h2>
      <p className="text-gray-600">
       إدارة العهد والمخازن والتقارير المالية.
      </p>
    </div>
  </div>
);

const Contact = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        التواصل والاعلام
      </h2>
      <p className="text-gray-600">
        إدارة التواصل مع أولياء الأمور والطلاب وتحديثات النظام.
      </p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        الاعدادات
      </h2>
      <p className="text-gray-600">
        إدارة تفضيلات النظام وأذونات المستخدم ومعلومات المدرسة.
      </p>
    </div>
  </div>
);
export default {
  StudentsPage,
  CoursesPage,
  SchedulePage,
  ReportsPage,
  Contact,
  SettingsPage,
};
export {
  StudentsPage,
  CoursesPage,
  SchedulePage,
  ReportsPage,
  Contact,
  SettingsPage,
};
