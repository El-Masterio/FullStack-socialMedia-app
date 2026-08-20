import { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';
import Avatar from './Avatar';

const ACCEPTED = [
  'image/png',
  'image/svg+xml',
  'image/gif',
  'image/jpeg',
  'image/tiff',
  'image/webp',
];

const field =
  'w-full rounded-card border border-edge bg-surface px-4 py-3 text-ink outline-none transition-all duration-200 placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/25';

const CreatePin = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [saving, setSaving] = useState(false);
  /* Arriving from an empty category page pre-selects that category. */
  const [category, setCategory] = useState(location.state?.category || '');
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const uploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setWrongImageType(true);
      return;
    }

    setWrongImageType(false);
    setLoading(true);
    client.assets
      .upload('image', file, { contentType: file.type, filename: file.name })
      .then((document) => {
        setImageAsset(document);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Image upload error', error);
        setLoading(false);
      });
  };

  /* Only a photo, a title and a category are required. Description and link
     are optional, and are omitted from the document entirely when blank
     rather than stored as empty strings. */
  const missing = [
    !imageAsset?._id && 'an image',
    !title.trim() && 'a title',
    !category && 'a category',
  ].filter(Boolean);

  const savePin = () => {
    if (missing.length) {
      setFields(true);
      setTimeout(() => setFields(false), 3000);
      return;
    }

    setSaving(true);
    client
      .create({
        _type: 'pin',
        title: title.trim(),
        ...(about.trim() ? { about: about.trim() } : {}),
        ...(destination.trim() ? { destination: destination.trim() } : {}),
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAsset._id },
        },
        userId: user._id,
        postedBy: { _type: 'postedBy', _ref: user._id },
        category,
      })
      .then(() => navigate('/'))
      .catch((err) => {
        console.error('Could not publish pin', err);
        setSaving(false);
      });
  };

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <div className="mb-7 animate-rise">
        <h1 className="text-3xl text-ink md:text-4xl">Create a pin</h1>
        <p className="mt-1 text-sm text-muted">
          Share a photo with everyone on Picture Perfect.
        </p>
      </div>

      {fields && (
        <p
          role="alert"
          className="mb-5 rounded-card border border-accent/30 bg-accent-soft
                     px-4 py-3 text-sm font-medium text-accent"
        >
          Still needed: {missing.join(', ')}.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload well */}
        <div className="rounded-card border border-edge bg-surface p-3">
          <div
            className="grid h-[420px] place-items-center rounded-[10px]
                       border-2 border-dashed border-edge bg-raised
                       transition-colors hover:border-accent/50"
          >
            {loading ? (
              <Spinner message="Uploading your image…" />
            ) : imageAsset ? (
              <div className="relative h-full w-full">
                <img
                  src={imageAsset.url}
                  alt="Upload preview"
                  className="h-full w-full rounded-[10px] object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageAsset(null)}
                  aria-label="Remove image"
                  className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center
                             rounded-full bg-black/60 text-white backdrop-blur-md
                             transition hover:bg-accent"
                >
                  <MdDelete size={19} />
                </button>
              </div>
            ) : (
              <label className="flex h-full w-full cursor-pointer flex-col
                                items-center justify-center gap-3 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full
                                 bg-accent-soft text-accent">
                  <AiOutlineCloudUpload size={24} />
                </span>
                <span className="font-semibold text-ink">Click to upload</span>
                <span className="max-w-[16rem] text-xs leading-relaxed text-faint">
                  JPG, PNG, WebP, SVG or GIF — up to 20&nbsp;MB
                </span>
                {wrongImageType && (
                  <span className="text-xs font-medium text-accent">
                    That file type isn’t supported.
                  </span>
                )}
                <input
                  type="file"
                  name="upload-image"
                  accept={ACCEPTED.join(',')}
                  onChange={uploadImage}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title *"
            className={`${field} font-display text-2xl font-semibold`}
          />

          {user && (
            <div className="flex items-center gap-2.5">
              <Avatar src={user.image} name={user.userName} size="sm" />
              <p className="text-sm font-semibold capitalize text-ink">
                {user.userName}
              </p>
            </div>
          )}

          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your pin is about (optional)"
            rows={3}
            className={`${field} resize-none`}
          />

          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Source or reference link, e.g. https://unsplash.com/… (optional)"
            className={field}
          />

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-[0.7rem] font-semibold uppercase
                         tracking-[0.14em] text-faint"
            >
              Category <span className="text-accent">*</span>
            </label>
            {/* Controlled, with explicit option values. Previously the value
                came from the option's text content, which meant it could not
                be preset programmatically. */}
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${field} cursor-pointer capitalize`}
            >
              <option value="">Select a category</option>
              {categories.map((item) => (
                <option key={item.name} value={item.name} className="capitalize">
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-1 flex flex-col gap-2 md:items-end">
            <p className="text-xs text-faint">
              <span className="text-accent">*</span> required — everything else
              is optional
            </p>
            <button
              type="button"
              onClick={savePin}
              disabled={saving}
              className="btn-accent w-full px-6 py-3.5 text-sm
                         disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              {saving ? 'Publishing…' : 'Publish pin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
