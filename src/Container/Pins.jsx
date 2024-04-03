import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Feed, PinDetail, CreatePin, Search } from '../Components';
import { homeUrl } from '../utils/data';

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="px-2 md:px-5 ">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="h-full">
        <Routes>
          {/* for Route when we use /:something that will be dynamic parameter that we can change inside the element */}
          <Route path={`/FullStack-socialMedia-app/`} element={<Feed />} />
          <Route
            path={`/FullStack-socialMedia-app/category/:categoryId`}
            element={<Feed />}
          />
          <Route
            path={`/FullStack-socialMedia-app/pin-detail/:pinId`}
            element={<PinDetail user={user} />}
          />
          <Route
            path={`/FullStack-socialMedia-app/create-pin`}
            element={<CreatePin user={user} />}
          />
          <Route
            path={`/FullStack-socialMedia-app/search`}
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
