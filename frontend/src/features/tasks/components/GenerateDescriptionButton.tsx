interface GenerateDescriptionButtonProps {
  loading?: boolean;
  onClick: () => void;
}

export default function GenerateDescriptionButton({
  loading,
  onClick,
}: GenerateDescriptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded-md bg-black px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Generating..." : "Generate Description"}
    </button>
  );
}
