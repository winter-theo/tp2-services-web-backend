import { useEffect, useState } from "react";
import TiptapEditor from "./TiptapEditor";

const toInitialState = (initialValues) => ({
  title: initialValues?.title ?? "",
  content: initialValues?.content ?? "",
  status: initialValues?.status ?? "DRAFT",
  fishIds: initialValues?.fishIds ?? [],
});

export default function ArticleForm({
  fishOptions,
  initialValues,
  onSubmit,
  submitLabel,
  loading,
  richContent,
  className = "",
}) {
  const [form, setForm] = useState(toInitialState(initialValues));
  useEffect(() => {
    setForm(toInitialState(initialValues));
  }, [initialValues]);

  const toggleFishSelection = (fishId) => {
    setForm((prev) => {
      if (prev.fishIds.includes(fishId)) {
        return { ...prev, fishIds: prev.fishIds.filter((id) => id !== fishId) };
      }
      return { ...prev, fishIds: [...prev.fishIds, fishId] };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      title: form.title,
      content: form.content,
      status: form.status,
      fishIds: form.fishIds,
    });
  };

  return (
    <form className={`form ${className}`.trim()} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        required
      />
      {richContent ? (
        <TiptapEditor
          value={form.content}
          onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
          placeholder="Contenu riche de l'article..."
        />
      ) : (
        <textarea
          placeholder="Contenu"
          value={form.content}
          onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          rows={6}
          required
        />
      )}
      <select
        value={form.status}
        onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
      >
        <option value="DRAFT">DRAFT</option>
        <option value="PUBLISHED">PUBLISHED</option>
      </select>
      <div className="checkbox-grid">
        {fishOptions.map((fish) => (
          <label key={fish.id} className="check-item">
            <input
              type="checkbox"
              checked={form.fishIds.includes(fish.id)}
              onChange={() => toggleFishSelection(fish.id)}
            />
            {fish.name}
          </label>
        ))}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "En cours..." : submitLabel}
      </button>
    </form>
  );
}
