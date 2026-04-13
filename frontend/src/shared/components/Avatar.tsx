const AVATAR_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-danger)",
  "var(--color-primary-dark)",
  "var(--color-secondary-light)",
  "var(--color-primary-light)",
];

export function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colorIndex =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;

  const baseStyle: React.CSSProperties = {
    width: 34,
    height: 34,
    minWidth: 34,
    borderRadius: "50%",
    border: "2px solid var(--color-border)",
    objectFit: "cover",
  };

  if (src) {
    return <img src={src} alt={name} style={baseStyle} />;
  }

  return (
    <div
      aria-label={`Avatar for ${name}`}
      style={{
        ...baseStyle,
        background: AVATAR_COLORS[colorIndex],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-inverse)",
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.03em",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}