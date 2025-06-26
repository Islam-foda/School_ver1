import React, { useState } from 'react';
import Navigation from './assets/component/Navigation';
import Header from './assets/component/Header';
import DashboardContent from './assets/component/Dashboard';
import { StudentsPage, CoursesPage, SchedulePage, ReportsPage, Contact, SettingsPage } from './assets/component/Placeholder ';

const SchoolApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'students':
        return <StudentsPage />;
      case 'courses':
        return <CoursesPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'reports':
        return <ReportsPage />;
      case 'contact':
        return <Contact />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ltr:text-left rtl:text-right">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="ltr:lg:ml-64 rtl:lg:mr-64">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="min-h-screen bg-gray-50 p-4">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default SchoolApp;