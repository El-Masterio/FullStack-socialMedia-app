import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Feed, PinDetail, CreatePin, Search } from '../Components';

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    /* Horizontal padding lives on <main> in Home now; this wrapper used to
       add its own on top, and hardcoded bg-gray-50 which ignored dark mode. */
    <div>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        user={user}
      />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/category/:categoryId" element={<Feed />} />
        <Route path="/pin-detail/:pinId" element={<PinDetail user={user} />} />
        <Route path="/create-pin" element={<CreatePin user={user} />} />
        {/* Navbar navigates here on focus. This was previously '/', which
            duplicated the Feed route and made <Search /> unreachable. */}
        <Route
          path="/search"
          element={
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          }
        />
      </Routes>
    </div>
  );
};

export default Pins;
