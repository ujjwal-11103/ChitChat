import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ChatUI from '../Components/ChatUI'
import Home from "../Components/Home"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/chat" element={<ChatUI />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
