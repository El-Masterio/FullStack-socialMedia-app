import { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import { Sidebar, UserProfile } from '../Components';
import { client } from '../client';
import logo from '../assets/logo.png';
import Pins from './Pins';
import { homeUrl, userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const userInfo = fetchUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo?.sub !== undefined) {
      const query = userQuery(userInfo?.sub);
      client.fetch(query).then((data) => {
        setUser(data[0]);
      });
    } else {
      navigate(`/FullStack-socialMedia-app/login`);
    }
  }, [userInfo, navigate]);
  /* Including userInfo and navigate doesnt change anything because useEffect will only run if these two changes. Making useEffect in a sync with the variables */

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to={`/FullStack-socialMedia-app/`}>
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`/FullStack-socialMedia-app/user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-28" />
          </Link>
        </div>
      </div>

      {/* Medium Screen SideBar */}
      {toggleSidebar && (
        <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
          <div className="absolute w-full flex justify-end items-center p-2">
            <AiFillCloseCircle
              fontSize={30}
              className="cursor-pointer"
              onClick={() => setToggleSidebar(false)}
            />
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar} />
        </div>
      )}
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route
            path={`/FullStack-socialMedia-app/user-profile/:userId`}
            element={<UserProfile />}
          />
          <Route
            path={`/FullStack-socialMedia-app/*`}
            element={<Pins user={user && user} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
