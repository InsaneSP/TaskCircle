import '../styles/CreateTask.css';
import '../styles/Dashboard.css';
import '../styles/Navbar.css';
import '../styles/NotificationsPage.css';
import '../styles/TasksPage.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AppContent({ Component, pageProps }) {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
