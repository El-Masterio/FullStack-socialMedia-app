const Spinner = ({ message }) => (
  <div className="flex w-full flex-col items-center justify-center gap-4 py-10">
    {/* An aperture-style ring rather than the stock blue loader, which sat
        outside the palette entirely. */}
    <span
      className="h-9 w-9 animate-spin rounded-full border-2 border-edge
                 border-t-accent"
      role="status"
      aria-label="Loading"
    />
    {message && (
      <p className="px-2 text-center text-sm text-muted">{message}</p>
    )}
  </div>
);

export default Spinner;
