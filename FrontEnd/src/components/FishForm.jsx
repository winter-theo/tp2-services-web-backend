import { useEffect, useState } from "react";
import TiptapEditor from "./TiptapEditor";

const toInitialState = (initialValues) => ({
  name: initialValues?.name ?? "",
  description: initialValues?.description ?? "",
});

export default function FishForm({ initialValues, onSubmit, submitLabel, loading, richDescription }) {
  const [form, setForm] = useState(toInitialState(initialValues));

  useEffect(() => {
    setForm(toInitialState(initialValues));
  }, [initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      name: form.name,
      description: form.description,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom"
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        required
      />
      {richDescription ? (
        <TiptapEditor
          value={form.description}
          onChange={(html) => setForm((prev) => ({ ...prev, description: html }))}
          placeholder="Description riche de la fiche poisson..."
        />
      ) : (
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={6}
          required
        />
      )}
      <button type="submit" disabled={loading}>
        {loading ? "En cours..." : submitLabel}
      </button>
    </form>
  );
}
