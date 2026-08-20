import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';

/* Replaces the three different bare strings that used to stand in for an
   empty result ("No Pins available", "No Pins Found!", "No pins Found!"). */

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  actionState,
}) => (
  <div className="flex flex-col items-center justify-center text-center
                  px-6 py-20 animate-rise">
    {/* Concentric rings echo a camera aperture without needing artwork. */}
    <div className="relative mb-7 grid place-items-center">
      <span className="absolute h-28 w-28 rounded-full border border-edge" />
      <span className="absolute h-20 w-20 rounded-full border border-edge" />
      <span
        className="grid h-14 w-14 place-items-center rounded-full
                   bg-accent-soft text-accent"
      >
        {icon}
      </span>
    </div>

    <h2 className="text-2xl md:text-[1.75rem] leading-tight text-ink">
      {title}
    </h2>

    {description && (
      <p className="mt-2.5 max-w-sm text-[0.95rem] leading-relaxed text-muted">
        {description}
      </p>
    )}

    {actionLabel && actionTo && (
      <Link
        to={actionTo}
        state={actionState}
        className="btn-accent mt-7 inline-flex items-center gap-2 px-6 py-3 text-sm"
      >
        <IoMdAdd size={17} />
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
