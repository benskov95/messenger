import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './root-css/App.css';
import Home from './components/Home';
import Login from "./components/Login"
import Conversation from "./components/Conversation";
import FriendBar from './components/FriendBar';
import Register from './components/Register';
import Error from './components/Error';
import NotFound from "./components/NotFound";

function App() {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  return (
    <BrowserRouter>
      <div className="App">
        {isLoggedIn &&
          <FriendBar 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn}
          user={user} 
          setUser={setUser} 
          friends={friends}
          setFriends={setFriends}
          unreadMessages={unreadMessages}
          setUnreadMessages={setUnreadMessages}
          setError={setError} />
        }

        <Error error={error} setError={setError} />

        <Routes>
          <Route path="/" element={<Navigate replace to="/messenger" />} />
          <Route path="/messenger" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} setError={setError} />} />
          <Route path="/messenger/register" element={<Register />} />
          <Route path="/messenger/home" element={<Home isLoggedIn={isLoggedIn} user={user} setFriends={setFriends} setError={setError} />} />
          <Route path={"messenger/convo/:userId"} element={<Conversation user={user} setUnreadMessages={setUnreadMessages} setError={setError} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
