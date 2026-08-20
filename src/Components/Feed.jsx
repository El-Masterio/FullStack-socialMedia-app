import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlinePhotograph } from 'react-icons/hi';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import PinSkeleton from './PinSkeleton';
import EmptyState from './EmptyState';
import { feedQuery, searchQuery } from '../utils/data';

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const query = categoryId ? searchQuery(categoryId) : feedQuery;
    client
      .fetch(query)
      .then((data) => {
        /* Guard against a slow response for a category the user already
           navigated away from overwriting the current one. */
        if (cancelled) return;
        setPins(data);
        setLoading(false);
      })
      .catch(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  if (loading) return <PinSkeleton />;

  if (!pins?.length) {
    return categoryId ? (
      <EmptyState
        icon={<HiOutlinePhotograph size={24} />}
        title={`Nothing in ${categoryId} yet`}
        description={`No one has added a ${categoryId} pin so far. Be the first to start this collection.`}
        actionLabel={`Add the first ${categoryId} pin`}
        actionTo="/create-pin"
        actionState={{ category: categoryId }}
      />
    ) : (
      <EmptyState
        icon={<HiOutlinePhotograph size={24} />}
        title="Your feed is empty"
        description="Once photos are shared they'll appear here. Add one to get things moving."
        actionLabel="Create a pin"
        actionTo="/create-pin"
      />
    );
  }

  return (
    <div>
      {categoryId && (
        <div className="mb-6 animate-rise">
          <h1 className="text-3xl capitalize text-ink md:text-4xl">
            {categoryId}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {pins.length} {pins.length === 1 ? 'pin' : 'pins'}
          </p>
        </div>
      )}
      <MasonryLayout pins={pins} />
    </div>
  );
};

export default Feed;
