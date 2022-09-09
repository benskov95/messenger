import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './root-css/App.css';
import Home from './components/Home';
import Login from "./components/Login"
import Conversation from "./components/Conversation";
import FriendBar from './components/FriendBar';
import Register from './components/Register';
import Error from './components/Error';
import NotFound from "./components/NotFound";

function App() {
  const routerPath = process.env.REACT_APP_ROUTER_PATH;
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
          routerPath={routerPath}
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
          <Route path={routerPath} element={<Login routerPath={routerPath} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} setError={setError} />} />
          <Route path={`${routerPath}register`} element={<Register routerPath={routerPath} />} />
          <Route path={`${routerPath}home`} element={<Home isLoggedIn={isLoggedIn} user={user} setFriends={setFriends} setError={setError} />} />
          <Route path={`${routerPath}convo/:userId`} element={<Conversation user={user} setUnreadMessages={setUnreadMessages} setError={setError} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
