import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';

import logo from '../assets/logo.png';
import logoWhite from '../assets/logowhite.png';
import { categories } from '../utils/data';
import Avatar from './Avatar';

const link =
  'flex items-center gap-3 rounded-pill px-4 py-2.5 text-[0.9rem] capitalize transition-all duration-200 ease-out';
const idle = `${link} text-muted hover:bg-raised hover:text-ink`;
const active = `${link} bg-accent-soft font-semibold text-accent`;

const Sidebar = ({ user, closeToggle }) => {
  const close = () => closeToggle && closeToggle(false);

  return (
    <div className="flex h-full min-w-[240px] flex-col justify-between
                    border-r border-edge bg-surface">
      <div className="flex min-h-0 flex-1 flex-col">
        <Link
          to="/"
          onClick={close}
          aria-label="Picture Perfect, home"
          className="flex shrink-0 items-center px-5 pb-4 pt-6"
        >
          {/* Two marks, one per theme - the dark logo is invisible on ink. */}
          <img src={logo} alt="" className="w-36 dark:hidden" />
          <img
            src={logoWhite}
            alt=""
            className="hidden w-36 dark:block"
          />
        </Link>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-3 pb-4">
          <NavLink
            to="/"
            end
            onClick={close}
            className={({ isActive }) => (isActive ? active : idle)}
          >
            <RiHomeFill size={18} />
            Home
          </NavLink>

          <h3 className="px-4 pb-2 pt-6 font-sans text-[0.7rem] font-semibold
                         uppercase tracking-[0.14em] text-faint">
            Discover
          </h3>

          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              key={category.name}
              to={`/category/${category.name}`}
              onClick={close}
              className={({ isActive }) => (isActive ? active : idle)}
            >
              <img
                src={category.image}
                alt=""
                loading="lazy"
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>

      {user?._id && (
        <Link
          to={`/user-profile/${user._id}`}
          onClick={close}
          className="m-3 flex shrink-0 items-center gap-3 rounded-card border
                     border-edge bg-raised p-3 transition-colors hover:bg-edge"
        >
          <Avatar src={user.image} name={user.userName} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-ink">
              {user.userName}
            </p>
            <p className="text-xs text-faint">View profile</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
