export function Icon({ name }: { name: string }) {
  return (
    <svg className="icon">
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
}

