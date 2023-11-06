import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Components/Login/Login';
import StoreOwner from './Components/StoreOwner/StoreOwner';
import SiteManager from './Components/SiteManager/SiteManager';
import Customer from './Components/Customer/Customer';
import CreateStore from './Components/CreateStore/CreateStore';

function App() {
  return (

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store-view" element={<StoreOwner />} />
        <Route path="/site-manager-view/:id" element={<SiteManager />} />
        <Route path="/customer-view" element={<Customer />} />
        <Route path="/create-store" element={<CreateStore />}/>
      </Routes>

    );
}

export default App;
