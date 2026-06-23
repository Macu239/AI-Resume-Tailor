import "./submitBtn.css";

export default function SubmitBtn({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label?: string;
}) {
  return (
    <button onClick={onClick} disabled={loading} className="SubmitBtn">
      {label ?? (loading ? "Tailoring..." : "Tailor bullets")}
    </button>
  );
}
