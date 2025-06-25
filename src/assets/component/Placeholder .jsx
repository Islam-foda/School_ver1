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
        Student registration, profiles, and academic records will be managed
        here.
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
        Create, edit, and manage courses, curriculum, and learning materials.
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
        Plan and organize class schedules, events, and academic calendar.
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
        Generate comprehensive reports on attendance, grades, and performance.
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
        Configure system preferences, user permissions, and school information.
      </p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Settings
      </h2>
      <p className="text-gray-600">
        Configure system preferences, user permissions, and school information.
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
