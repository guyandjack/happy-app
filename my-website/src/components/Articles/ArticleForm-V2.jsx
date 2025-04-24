import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function ArticleFormV2({ onSubmitSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const watchTitle = watch("title", "");
  const watchContent = watch("content", "");
  const watchFiles = watch("images", []);

  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  useEffect(() => {
    const slug = slugify(watchTitle);
    setValue("slug", slug);
  }, [watchTitle, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setResponseMsg("");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("content", data.content);

    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file); // même nom pour tous si backend gère en tableau
      });
    }

    try {
      const response = await fetch("http://localhost:3000/api/articles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMsg("✅ Article ajouté avec succès !");
        reset();
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        setResponseMsg(`❌ Erreur: ${result.message || "Échec de l'ajout"}`);
      }
    } catch (error) {
      console.error(error);
      setResponseMsg("❌ Erreur serveur ou réseau.");
    }

    setSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-semibold">Ajouter un article</h2>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Catégorie *</label>
          <select
            id="category"
            {...register("category", {
              required: "La catégorie est requise",
            })}
            className={errors.category ? "error" : ""}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="error-message">{errors.category.message}</div>
          )}
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags (séparés par des virgules)</label>
          <input
            type="text"
            id="tags"
            {...register("tags")}
            placeholder="ex: javascript, react, web"
          />
        </div>
        <input
          type="text"
          placeholder="Titre de l'article"
          {...register("title", { required: "Le titre est requis" })}
          className="border p-2 rounded"
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}

        <input
          type="text"
          placeholder="Slug"
          {...register("slug")}
          className="border p-2 rounded bg-gray-100 text-gray-600"
          readOnly
        />

        <textarea
          placeholder="Contenu (en markdown)"
          {...register("content", { required: "Le contenu est requis" })}
          rows={10}
          className="border p-2 rounded font-mono text-sm"
        />
        {errors.content && (
          <span className="text-red-500">{errors.content.message}</span>
        )}

        {/* Champ fichiers (multi images) */}
        <div>
          <label className="font-medium">Images (facultatif)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("images")}
            className="border p-2 rounded w-full"
          />
          {watchFiles && watchFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {Array.from(watchFiles).map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {submitting ? "Envoi en cours..." : "Publier l'article"}
        </button>

        {responseMsg && <p className="mt-2 text-sm">{responseMsg}</p>}
      </form>

      {/* PRÉVISUALISATION MARKDOWN */}
      <div className="bg-white border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">🖼️ Aperçu de l’article</h3>
        {watchContent.trim() === "" ? (
          <p className="text-gray-400 italic">
            Commence à écrire du contenu...
          </p>
        ) : (
          <ReactMarkdown className="prose prose-sm max-w-none">
            {watchContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default ArticleFormV2;
