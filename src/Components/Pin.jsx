import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';
import Avatar from './Avatar';

/* The old card asked Sanity for a single 250px-wide render, then displayed it
   in a 400-600px column - the browser upscaled it ~2x, which is why pins
   looked soft in the grid but sharp on the detail page. Now we hand the
   browser a srcSet and let it pick. auto('format') serves WebP where
   supported, so these are usually SMALLER files despite more pixels. */
const WIDTHS = [300, 500, 800, 1100];
const render = (image, w) =>
  urlFor(image).width(w).auto('format').quality(75).url();

const Pin = ({ pin: { postedBy, image, _id, destination, save }, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [savedList, setSavedList] = useState(save || []);
  const [deleted, setDeleted] = useState(false);

  const navigate = useNavigate();
  const user = fetchUser();

  const alreadySaved = !!savedList?.filter(
    (item) => item?.postedBy?._id === user?.sub
  )?.length;

  const savePin = (id) => {
    if (alreadySaved) return;
    client
      .patch(id)
      .setIfMissing({ save: [] })
      .insert('after', 'save[-1]', [
        {
          _key: uuidv4(),
          userId: user?.sub,
          postedBy: { _type: 'postedBy', _ref: user?.sub },
        },
      ])
      .commit()
      .then(() =>
        setSavedList((prev) => [
          ...(prev || []),
          { _key: uuidv4(), userId: user?.sub, postedBy: { _id: user?.sub } },
        ])
      );
  };

  const deletePin = (id) => client.delete(id).then(() => setDeleted(true));

  if (deleted) return null;

  const stop = (e) => e.stopPropagation();
  const ratio = image?.asset?.metadata?.dimensions?.aspectRatio;

  return (
    <div
      className="mb-4 animate-rise"
      /* Staggered reveal, capped so a long feed doesn't crawl in. */
      style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="group relative w-full cursor-zoom-in overflow-hidden
                   rounded-card bg-raised shadow-lift transition-shadow
                   duration-300 ease-out hover:shadow-hover"
        /* Reserving the ratio stops the masonry grid reflowing as images
           arrive. Falls back to a pleasant portrait when metadata is absent. */
        style={{ aspectRatio: ratio || '3 / 4' }}
      >
        <img
          className={`h-full w-full object-cover transition-all duration-[600ms] ease-out
                      ${loaded ? 'opacity-100' : 'opacity-0'}
                      ${hovered ? 'scale-[1.04]' : 'scale-100'}`}
          alt={`Pin by ${postedBy?.userName || 'a user'}`}
          src={render(image, 500)}
          srcSet={WIDTHS.map((w) => `${render(image, w)} ${w}w`).join(', ')}
          sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, (max-width:1280px) 33vw, (max-width:1800px) 25vw, 20vw"
          loading={index < 6 ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
        />

        {/* Scrim: white controls were previously invisible on pale photos. */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b
                      from-black/45 via-transparent to-black/45
                      transition-opacity duration-300
                      ${hovered ? 'opacity-100' : 'opacity-0'}`}
        />

        <div
          className={`absolute inset-0 flex flex-col justify-between p-3
                      transition-all duration-300 ease-out
                      ${hovered ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <div className="flex items-start justify-between gap-2">
            <a
              href={`${image?.asset?.url}?dl=`}
              download
              onClick={stop}
              aria-label="Download image"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/95
                         text-black shadow-lift backdrop-blur transition
                         hover:scale-110 hover:bg-white"
            >
              <MdDownloadForOffline size={19} />
            </a>

            <button
              type="button"
              onClick={(e) => {
                stop(e);
                savePin(_id);
              }}
              disabled={alreadySaved}
              className={`rounded-pill px-4 py-2 text-xs font-semibold shadow-lift
                          transition hover:scale-105
                          ${
                            alreadySaved
                              ? 'bg-white/90 text-black'
                              : 'bg-accent text-on-accent'
                          }`}
            >
              {alreadySaved ? `${savedList?.length} saved` : 'Save'}
            </button>
          </div>

          <div className="flex items-end justify-between gap-2">
            {destination ? (
              <a
                href={destination}
                target="_blank"
                rel="noreferrer"
                onClick={stop}
                className="flex items-center gap-1.5 rounded-pill bg-white/95 px-3 py-1.5
                           text-xs font-medium text-black shadow-lift backdrop-blur
                           transition hover:bg-white"
              >
                <BsFillArrowUpRightCircleFill size={13} />
                {destination.replace(/^https?:\/\/(www\.)?/, '').slice(0, 18)}
              </a>
            ) : (
              <span />
            )}

            {postedBy?._id === user?.sub && (
              <button
                type="button"
                onClick={(e) => {
                  stop(e);
                  deletePin(_id);
                }}
                aria-label="Delete pin"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/95
                           text-black shadow-lift backdrop-blur transition
                           hover:scale-110 hover:bg-accent hover:text-on-accent"
              >
                <AiTwotoneDelete size={17} />
              </button>
            )}
          </div>
        </div>
      </div>

      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="mt-2.5 flex items-center gap-2 px-0.5 group/user"
      >
        <Avatar src={postedBy?.image} name={postedBy?.userName} size="xs" />
        <p className="truncate text-[0.8rem] font-medium capitalize text-muted
                      transition-colors group-hover/user:text-ink">
          {postedBy?.userName}
        </p>
      </Link>
    </div>
  );
};

export default Pin;
