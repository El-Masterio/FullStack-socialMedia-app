import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breakpointObj = {
  default: 4,
  3000: 5, // this is to set how many images in a row to display (in 3000 or more show 6 and other values)
  2000: 4,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} className="w-max " />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
