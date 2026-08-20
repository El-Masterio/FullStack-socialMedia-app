import { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { HiOutlinePhotograph, HiOutlineBookmark } from 'react-icons/hi';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from '../utils/data';
import { client } from '../client';
import { fetchUser } from '../utils/fetchUser';
import MasonryLayout from './MasonryLayout';
import PinSkeleton from './PinSkeleton';
import EmptyState from './EmptyState';
import Avatar from './Avatar';

const TABS = ['Created', 'Saved'];

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Created');

  const navigate = useNavigate();
  const { userId } = useParams();
  /* The viewer, which is NOT the profile being viewed. */
  const loggedInUser = fetchUser();
  const isOwnProfile = loggedInUser?.sub === userId;

  useEffect(() => {
    client.fetch(userQuery(userId)).then((data) => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const query =
      tab === 'Created'
        ? userCreatedPinsQuery(userId)
        : userSavedPinsQuery(userId);

    client
      .fetch(query)
      .then((data) => {
        if (cancelled) return;
        setPins(data);
        setLoading(false);
      })
      .catch(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [tab, userId]);

  const handleLogout = () => {
    try {
      googleLogout();
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return <PinSkeleton count={6} />;

  return (
    <div className="pb-8">
      {/* The old banner pulled from source.unsplash.com, which Unsplash
          discontinued - it had been returning 503 on every profile view.
          A painted gradient can't rot. */}
      {/* The gradient is clipped, the avatar block deliberately is NOT -
          overflow-hidden on the outer wrapper cropped the avatar and hid the
          username entirely. */}
      <div className="relative mb-24 h-52 md:h-72">
        <div
          className="absolute inset-0 overflow-hidden rounded-card"
          style={{
            background:
              'radial-gradient(120% 140% at 18% 0%, rgb(var(--c-accent)) 0%, rgb(var(--c-accent) / 0.55) 34%, transparent 68%), linear-gradient(150deg, #2a1512 0%, #140d0c 55%, #0b0808 100%)',
          }}
        />

        {isOwnProfile && (
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center
                       rounded-full bg-black/35 text-white backdrop-blur-md
                       transition hover:bg-accent"
          >
            <AiOutlineLogout size={18} />
          </button>
        )}

        <div className="absolute -bottom-20 left-1/2 z-10 flex -translate-x-1/2
                        flex-col items-center">
          <Avatar
            src={user.image}
            name={user.userName}
            size="xl"
            className="shadow-hover ring-4 ring-canvas"
          />
          <h1 className="mt-3 whitespace-nowrap text-2xl capitalize text-ink md:text-3xl">
            {user.userName}
          </h1>
        </div>
      </div>

      <div className="mb-7 flex justify-center">
        <div className="inline-flex gap-1 rounded-pill bg-raised p-1">
          {TABS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setTab(label)}
              className={`rounded-pill px-6 py-2 text-sm font-medium transition-all
                          duration-200 ease-out ${
                            tab === label
                              ? 'bg-accent text-on-accent shadow-lift'
                              : 'text-muted hover:text-ink'
                          }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <PinSkeleton count={8} />
      ) : pins?.length ? (
        <MasonryLayout pins={pins} />
      ) : tab === 'Created' ? (
        <EmptyState
          icon={<HiOutlinePhotograph size={24} />}
          title={isOwnProfile ? 'You haven’t created any pins' : 'No pins yet'}
          description={
            isOwnProfile
              ? 'Share your first photo and it will show up right here.'
              : `${user.userName} hasn’t shared anything yet.`
          }
          actionLabel={isOwnProfile ? 'Create your first pin' : undefined}
          actionTo={isOwnProfile ? '/create-pin' : undefined}
        />
      ) : (
        <EmptyState
          icon={<HiOutlineBookmark size={24} />}
          title="Nothing saved yet"
          description={
            isOwnProfile
              ? 'Pins you save will be collected here for later.'
              : `${user.userName} hasn’t saved any pins yet.`
          }
        />
      )}
    </div>
  );
};

export default UserProfile;
