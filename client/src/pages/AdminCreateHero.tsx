import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSuperhero } from "../services/api";

interface NewHeroForm {
    nickname: string;
    real_name?: string;
    origin_description?: string;
    superpowers?: string;
    catch_phrase?: string;
    images?: File[];
}

const AdminCreateHero: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<NewHeroForm>({
        nickname: "",
        real_name: "",
        origin_description: "",
        superpowers: "",
        catch_phrase: "",
        images: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            setForm((prev) => ({
                ...prev,
                images: Array.from(files),
            }));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileChange(e.dataTransfer.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("nickname", form.nickname);
            if (form.real_name) formData.append("real_name", form.real_name);
            if (form.origin_description)
                formData.append("origin_description", form.origin_description);
            if (form.superpowers) formData.append("superpowers", form.superpowers);
            if (form.catch_phrase) formData.append("catch_phrase", form.catch_phrase);

            form.images?.forEach((file) => formData.append("images", file));

            await createSuperhero(formData);
            navigate("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            { }
            <div
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="fileUpload"
                    accept="image/*"
                    multiple
                    className="file-input"
                    onChange={(e) => handleFileChange(e.target.files)}
                />
                <label htmlFor="fileUpload" className="dropzone-label">
                    <p className="dropzone-title">
                        Перетягніть файли сюди або натисніть, щоб вибрати
                    </p>
                    <p className="dropzone-subtitle">Формат: JPG, PNG</p>
                </label>

                { }
                {form.images && form.images.length > 0 && (
                    <div className="preview-grid">
                        {form.images.map((file, index) => (
                            <div key={index} className="preview-item">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="preview-img"
                                />
                                <button
                                    type="button"
                                    className="preview-remove"
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            images: prev.images?.filter((_, i) => i !== index) || [],
                                        }))
                                    }
                                >
                                    ✕
                                </button>
                                <p className="preview-name">{file.name}</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            { }
            <div className="hero-form-wrapper">
                <h2>Створити нового героя</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="hero-form">
                    <input
                        type="text"
                        name="nickname"
                        placeholder="Nickname"
                        value={form.nickname}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="real_name"
                        placeholder="Real Name"
                        value={form.real_name}
                        onChange={handleChange}
                    />
                    <textarea
                        name="origin_description"
                        placeholder="Origin Description"
                        value={form.origin_description}
                        onChange={handleChange}
                    />
                    <textarea
                        name="superpowers"
                        placeholder="Superpowers"
                        value={form.superpowers}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="catch_phrase"
                        placeholder="Catch Phrase"
                        value={form.catch_phrase}
                        onChange={handleChange}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Створюємо..." : "Створити героя"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateHero;
