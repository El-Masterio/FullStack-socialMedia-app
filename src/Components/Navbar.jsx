import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch, IoMdClose } from 'react-icons/io';

import Avatar from './Avatar';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  /* Previously this returned null until `user` resolved, so a slow Sanity
     response made the entire top bar - search, create, profile - vanish.
     The bar now renders immediately and only the avatar waits. */
  return (
    <div
      className="sticky top-0 z-20 -mx-2 mb-6 flex items-center gap-2 border-b
                 border-edge bg-canvas/80 px-2 py-3 backdrop-blur-xl md:-mx-5 md:px-5"
    >
      <div
        className="group flex w-full items-center gap-2 rounded-pill bg-raised px-4
                   ring-1 ring-transparent transition-all duration-200
                   focus-within:bg-surface focus-within:ring-accent/40"
      >
        <IoMdSearch size={20} className="shrink-0 text-faint" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => navigate('/search')}
          placeholder="Search for photos, people, ideas…"
          className="w-full bg-transparent py-2.5 text-[0.95rem] text-ink
                     outline-none placeholder:text-faint"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
            className="shrink-0 text-faint transition-colors hover:text-ink"
          >
            <IoMdClose size={18} />
          </button>
        )}
      </div>

      {/* The mobile header already carries a toggle - showing both stacked
          two identical moon buttons on small screens. */}
      <ThemeToggle className="hidden md:grid" />

      {user?._id && (
        <Link
          to={`/user-profile/${user._id}`}
          className="hidden shrink-0 transition-transform hover:scale-105 md:block"
          aria-label="Your profile"
        >
          <Avatar src={user.image} name={user.userName} size="md" />
        </Link>
      )}

      <Link
        to="/create-pin"
        aria-label="Create a pin"
        className="btn-accent grid h-11 w-11 shrink-0 place-items-center"
      >
        <IoMdAdd size={22} />
      </Link>
    </div>
  );
};

export default Navbar;
