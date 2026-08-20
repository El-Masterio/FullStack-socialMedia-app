import { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';

import MasonryLayout from './MasonryLayout';
import PinSkeleton from './PinSkeleton';
import EmptyState from './EmptyState';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    /* Debounced: the old version fired a query on every keystroke. */
    const timer = setTimeout(() => {
      const query = searchTerm
        ? searchQuery(searchTerm.toLowerCase())
        : feedQuery;

      client
        .fetch(query)
        .then((data) => {
          if (cancelled) return;
          setPins(data);
          setLoading(false);
        })
        .catch(() => !cancelled && setLoading(false));
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  if (loading) return <PinSkeleton count={8} />;

  if (!pins?.length) {
    return (
      <EmptyState
        icon={<IoMdSearch size={24} />}
        title={searchTerm ? `No results for “${searchTerm}”` : 'Nothing to show'}
        description="Try a different word, or browse a category from the sidebar."
      />
    );
  }

  return (
    <div>
      {searchTerm && (
        <p className="mb-5 text-sm text-muted">
          {pins.length} {pins.length === 1 ? 'result' : 'results'} for{' '}
          <span className="font-semibold text-ink">“{searchTerm}”</span>
        </p>
      )}
      <MasonryLayout pins={pins} />
    </div>
  );
};

export default Search;
