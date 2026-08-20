import Masonry from 'react-masonry-css';
import Pin from './Pin';

/* Keys are max-widths. Exported so PinSkeleton lays out on the same grid,
   which stops the column count jumping when real pins replace the skeleton. */
export const breakpointObj = {
  default: 5,
  1800: 4,
  1280: 3,
  900: 2,
  600: 1,
};

const MasonryLayout = ({ pins }) => (
  /* Negative margin + matching column padding is react-masonry-css's
     gutter idiom; the old version had no gutter at all. */
  <Masonry
    className="flex -ml-4 w-auto"
    columnClassName="pl-4 bg-clip-padding"
    breakpointCols={breakpointObj}
  >
    {pins?.map((pin, i) => (
      <Pin key={pin._id} pin={pin} index={i} />
    ))}
  </Masonry>
);

export default MasonryLayout;
