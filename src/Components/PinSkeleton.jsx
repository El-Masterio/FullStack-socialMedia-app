import Masonry from 'react-masonry-css';
import { breakpointObj } from './MasonryLayout';

/* Varied heights so the loading state reads as a photo grid rather than a
   row of identical grey blocks. Deterministic, so it doesn't reshuffle on
   every render. */
const HEIGHTS = [260, 340, 220, 400, 300, 250, 380, 290, 330, 240, 360, 280];

const PinSkeleton = ({ count = 12 }) => (
  <Masonry className="flex -ml-4 w-auto" columnClassName="pl-4 bg-clip-padding"
    breakpointCols={breakpointObj}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="mb-4">
        <div
          style={{ height: HEIGHTS[i % HEIGHTS.length] }}
          className="relative overflow-hidden rounded-card bg-raised"
        >
          <div
            className="absolute inset-0 -translate-x-full animate-shimmer
                       bg-gradient-to-r from-transparent via-black/[0.06]
                       to-transparent dark:via-white/[0.06]"
          />
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-raised" />
          <div className="h-3 w-24 rounded-pill bg-raised" />
        </div>
      </div>
    ))}
  </Masonry>
);

export default PinSkeleton;
