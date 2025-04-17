import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProfileForm from './ProfileForm';
import SwipeView from './SwipeView';
import Chat from './Chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProfileForm />} />
      <Route path="/swipe" element={<SwipeView />} />
      <Route path="/chat/:matchId" element={<Chat />} />
    </Routes>
  );
}

export default App;

