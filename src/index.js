import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Redirect from './pages/Redirect'
import Homepage from './pages/Homepage'
import CurrentMovie from './pages/CurrentMovie'
import WatchLater from './pages/WatchLater'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/redirect' element={<Redirect />}/>
      <Route path='/homepage' element={<Homepage />}/>
      <Route path='/current-movie/:id' element={<CurrentMovie />}/>
      <Route path='/watch-later' element={<WatchLater />}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
