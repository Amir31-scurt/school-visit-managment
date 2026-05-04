import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { RequestForm } from '../pages/public/RequestForm';
import { Login } from '../pages/admin/Login';
import { Dashboard } from '../pages/admin/Dashboard';
import { Requests } from '../pages/admin/Requests';
import { Calendar } from '../pages/admin/Calendar';
import { Visits } from '../pages/admin/Visits';
import { Settings } from '../pages/admin/Settings';
import { AdminLayout } from '../components/layout/AdminLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RequestForm />
  },
  {
    path: '/admin/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '', element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'requests', element: <Requests /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'visits', element: <Visits /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
]);

export const Router = () => <RouterProvider router={router} />;
