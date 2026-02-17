export default function ApiStatus({ error, success }) {
  if (error) {
    return <p className="status error">{error}</p>;
  }
  if (success) {
    return <p className="status success">{success}</p>;
  }
  return null;
}
