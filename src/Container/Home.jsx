import { useState, useRef, useEffect, useMemo } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import { Sidebar, UserProfile } from '../Components';
import Avatar from '../Components/Avatar';
import ThemeToggle from '../Components/ThemeToggle';
import { client } from '../client';
import logo from '../assets/logo.png';
import logoWhite from '../assets/logowhite.png';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  /* fetchUser() re-parses localStorage and returns a NEW object every call.
     Memoised so it keeps a stable identity - otherwise the effect below sees
     a changed dependency on every render and re-fetches forever. */
  const userInfo = useMemo(() => fetchUser(), []);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.sub !== undefined) {
      client.fetch(userQuery(userInfo.sub)).then((data) => setUser(data[0]));
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  /* Effects run after the first render, so without this guard the whole app
     shell mounts for a moment before an unauthenticated visitor is redirected. */
  if (!userInfo?.sub) return null;

  return (
    <div className="grain relative flex h-screen flex-col bg-canvas
                    transition-colors duration-300 md:flex-row">
      <aside className="hidden h-screen flex-initial md:flex">
        <Sidebar user={user} />
      </aside>

      {/* Mobile bar */}
      <header className="flex items-center justify-between border-b border-edge
                         bg-surface/85 p-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => setToggleSidebar(true)}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-pill text-ink
                     transition hover:bg-raised"
        >
          <HiMenu size={26} />
        </button>

        <Link to="/" aria-label="Picture Perfect, home">
          <img src={logo} alt="" className="w-28 dark:hidden" />
          <img
            src={logoWhite}
            alt=""
            className="hidden w-28 dark:block"
          />
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {/* Rendered only once loaded - this used to link to
              /user-profile/undefined with a broken image. */}
          {user?._id && (
            <Link to={`/user-profile/${user._id}`} aria-label="Your profile">
              <Avatar src={user.image} name={user.userName} size="sm" />
            </Link>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {toggleSidebar && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setToggleSidebar(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />
          <div className="animate-slide-in absolute inset-y-0 left-0 w-4/5
                          max-w-xs overflow-y-auto shadow-hover">
            <div className="absolute right-3 top-3 z-10">
              <AiFillCloseCircle
                size={28}
                className="cursor-pointer text-muted transition hover:text-ink"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user} closeToggle={setToggleSidebar} />
          </div>
        </div>
      )}

      <main
        ref={scrollRef}
        className="hide-scrollbar relative z-10 h-screen flex-1
                   overflow-y-auto px-2 pb-4 md:px-5"
      >
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user} />} />
        </Routes>
      </main>
    </div>
  );
};

export default Home;
