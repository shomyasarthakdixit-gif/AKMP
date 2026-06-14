import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import CategoryManager from '../components/CategoryManager';
import CourseManager from '../components/CourseManager';
import UserManager from '../components/UserManager';
import Profile from '../components/Profile';
import DashboardOverview from '../components/DashboardOverview';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'ROLE_USER';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  const renderContent = () => {
    switch (activeTab) {
      case 'categories':
        if (role === 'ROLE_ADMIN' || role === 'ROLE_MEMBER') return <CategoryManager />;
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access to categories.</div>;
      case 'courses':
        return <CourseManager />;
      case 'users':
        if (role === 'ROLE_ADMIN') return <UserManager />;
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access to users.</div>;
      case 'settings':
      case 'profile':
        return <Profile />;
      case 'dashboard':
      default:
        return <DashboardOverview />; 
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'categories': return 'Manage Categories';
      case 'documents': return 'Manage Documents';
      case 'users': return 'Manage Users';
      case 'settings': return 'Settings & Profile';
      case 'dashboard':
      default: return 'Dashboard Overview';
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} title={getTitle()}>
      {renderContent()}
    </DashboardLayout>
  );
}
