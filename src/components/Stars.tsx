interface StarsProps {
  count: number;
}

export function Stars({ count }: Readonly<StarsProps>) {
  return (
    <span className="stars" aria-label={`${count} estrellas`}>
      {'★'.repeat(count)}
    </span>
  );
}
