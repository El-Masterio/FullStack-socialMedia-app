import { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import Avatar from './Avatar';

const fetchPinDetails = (pinId, setPinDetail, setPins) => {
  client.fetch(pinDetailQuery(pinId)).then((data) => {
    setPinDetail(data[0]);
    if (data[0]) {
      client.fetch(pinDetailMorePinQuery(data[0])).then(setPins);
    }
  });
};

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    fetchPinDetails(pinId, setPinDetail, setPins);
    window.scrollTo(0, 0);
  }, [pinId]);

  /* Optimistic: the comment appears immediately. The old flow waited for the
     write AND a full refetch before rendering anything, so posting felt slow
     even though the write itself takes ~90ms. */
  const addComment = () => {
    const text = comment.trim();
    if (!text || addingComment || !user?._id) return;

    const _key = uuidv4();
    const optimistic = {
      _key,
      comment: text,
      postedBy: {
        _id: user._id,
        userName: user.userName,
        image: user.image,
      },
    };

    setPinDetail((prev) => ({
      ...prev,
      comments: [...(prev?.comments || []), optimistic],
    }));
    setComment('');
    setAddingComment(true);

    client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .insert('after', 'comments[-1]', [
        { comment: text, _key, postedBy: { _type: 'postedBy', _ref: user._id } },
      ])
      .commit()
      .then(() => setAddingComment(false))
      .catch((err) => {
        console.error('Comment failed, rolling back', err);
        setPinDetail((prev) => ({
          ...prev,
          comments: (prev?.comments || []).filter((c) => c._key !== _key),
        }));
        setComment(text);
        setAddingComment(false);
      });
  };

  if (!pinDetail) return <Spinner message="Loading pin…" />;

  const { image, title, about, destination, postedBy, comments } = pinDetail;

  return (
    <div className="pb-10">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden
                      rounded-card border border-edge bg-surface shadow-lift
                      lg:flex-row">
        <div className="flex flex-initial items-start justify-center bg-raised
                        lg:max-w-[52%]">
          <img
            className="h-auto w-full object-contain"
            src={image && urlFor(image).width(1200).auto('format').url()}
            alt={title || 'Pin'}
          />
        </div>

        <div className="flex w-full flex-1 flex-col p-6 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <a
              href={image?.asset?.url ? `${image.asset.url}?dl=` : undefined}
              download
              aria-label="Download image"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full
                         bg-raised text-ink transition hover:bg-accent
                         hover:text-on-accent"
            >
              <MdDownloadForOffline size={20} />
            </a>

            {/* Guarded: this used to render the string "null" when a pin had
                no destination. */}
            {destination && (
              <a
                href={destination}
                target="_blank"
                rel="noreferrer"
                className="flex min-w-0 max-w-[16rem] items-center gap-2 rounded-pill
                           bg-raised px-4 py-2.5 text-sm font-medium text-ink
                           transition hover:bg-edge md:max-w-sm"
              >
                <BsFillArrowUpRightCircleFill size={14} className="shrink-0" />
                <span className="truncate">
                  {destination.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              </a>
            )}
          </div>

          <h1 className="break-words text-3xl leading-tight text-ink md:text-4xl">
            {title}
          </h1>
          {about && (
            <p className="mt-3 max-w-reading text-[0.95rem] leading-relaxed text-muted">
              {about}
            </p>
          )}

          <Link
            to={`/user-profile/${postedBy?._id}`}
            className="mt-6 flex w-fit items-center gap-3 rounded-pill
                       bg-raised py-2 pl-2 pr-5 transition hover:bg-edge"
          >
            <Avatar src={postedBy?.image} name={postedBy?.userName} size="sm" />
            <div className="leading-tight">
              <p className="text-sm font-semibold capitalize text-ink">
                {postedBy?.userName}
              </p>
              <p className="text-xs text-faint">Creator</p>
            </div>
          </Link>

          <h2 className="mb-1 mt-8 text-xl text-ink">
            {comments?.length
              ? `${comments.length} ${
                  comments.length === 1 ? 'comment' : 'comments'
                }`
              : 'Comments'}
          </h2>

          <div className="hide-scrollbar max-h-80 flex-1 overflow-y-auto pr-1">
            {comments?.length ? (
              comments.map((item) => (
                /* Keyed by _key, not the comment text - two identical
                   comments used to collide and drop one of them. */
                <div key={item._key} className="flex gap-3 py-3">
                  <Avatar
                    src={item.postedBy?.image}
                    name={item.postedBy?.userName}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold capitalize text-ink">
                      {item.postedBy?.userName}
                    </p>
                    <p className="text-sm leading-relaxed text-muted">
                      {item.comment}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-3 text-sm text-faint">
                No comments yet — start the conversation.
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-edge pt-5">
            <Avatar src={user?.image} name={user?.userName} size="sm" />
            <input
              className="min-w-0 flex-1 rounded-pill border border-edge bg-canvas
                         px-4 py-2.5 text-sm text-ink outline-none transition
                         placeholder:text-faint focus:border-accent
                         focus:ring-2 focus:ring-accent/25"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
            />
            <button
              type="button"
              onClick={addComment}
              disabled={addingComment || !comment.trim()}
              className="btn-accent shrink-0 px-5 py-2.5 text-sm
                         disabled:cursor-not-allowed disabled:opacity-45"
            >
              {addingComment ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
      </div>

      {pins?.length > 0 && (
        <>
          <h2 className="mb-5 mt-12 text-center text-2xl text-ink">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      )}
    </div>
  );
};

export default PinDetail;
