import "./submitBtn.css";

export default function SubmitBtn({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button onClick={onClick} disabled={loading} className="SubmitBtn">
      {loading ? "Tailoring..." : "Tailor Resume"}
    </button>
  );
}
