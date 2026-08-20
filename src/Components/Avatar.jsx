import { useState } from 'react';

/* One avatar to replace the seven hand-rolled <img> tags that had five
   different class combinations between them. Always square, always
   object-cover, always has a fallback. */

const SIZES = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-24 w-24 text-2xl',
};

/* Google serves avatars at =s96-c by default, which is soft on a 96px+
   render. Ask for 2x the display size instead. */
const upscaleGoogle = (url, px) =>
  typeof url === 'string' && url.includes('googleusercontent.com')
    ? url.replace(/=s\d+(-c)?$/, `=s${px}-c`)
    : url;

const PX = { xs: 56, sm: 72, md: 88, lg: 112, xl: 192 };

const Avatar = ({ src, name, size = 'sm', className = '', ring = false }) => {
  const [failed, setFailed] = useState(false);
  const initial = (name || '?').trim().charAt(0).toUpperCase();

  const base = `${SIZES[size]} shrink-0 rounded-full object-cover bg-raised
                ${ring ? 'ring-2 ring-surface' : ''} ${className}`;

  if (!src || failed) {
    return (
      <span
        aria-label={name || 'user'}
        className={`${base} grid place-items-center font-semibold
                    text-on-accent bg-accent select-none`}
      >
        {initial}
      </span>
    );
  }

  return (
    <img
      src={upscaleGoogle(src, PX[size])}
      alt={name || 'user'}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={base}
    />
  );
};

export default Avatar;
