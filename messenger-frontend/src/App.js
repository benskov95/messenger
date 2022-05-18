import { useState } from 'react';
import { Route, Routes } from 'react-router';
import './root-css/App.css';
import Home from './components/Home';
import Login from "./components/Login"
import Conversation from "./components/Conversation";
import FriendBar from './components/FriendBar';
import { BrowserRouter } from 'react-router-dom';
import Register from './components/Register';
import Error from './components/Error';

function App() {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  return (
    <BrowserRouter>
      <div className="App">
        <FriendBar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn}
        user={user} 
        setUser={setUser} 
        friends={friends}
        setFriends={setFriends}
        setError={setError} />

        <Error error={error} setError={setError} />

        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/home" element={<Home isLoggedIn={isLoggedIn} user={user} setFriends={setFriends} setError={setError} />} />
          <Route path="/convo/:userId" element={<Conversation user={user} setError={setError} />} />
          <Route path="/" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} setError={setError} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
