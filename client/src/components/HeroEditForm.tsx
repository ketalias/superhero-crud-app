import React, { useState, useEffect } from "react";
import type { Superhero } from "../services/api";
import { updateSuperhero } from "../services/api";

interface HeroEditFormProps {
    hero: Superhero;
    onClose: () => void;
    onUpdate: (updatedHero: Superhero) => void;
}

const HeroEditForm: React.FC<HeroEditFormProps> = ({ hero, onClose, onUpdate }) => {
    const [form, setForm] = useState({
        nickname: hero.nickname || "",
        real_name: hero.real_name || "",
        origin_description: hero.origin_description || "",
        superpowers: hero.superpowers || "",
        catch_phrase: hero.catch_phrase || "",
    });
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            setFiles(prev => [...prev, ...fileArray]);
        }
    };

    useEffect(() => {
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);

        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [files]);

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const heroId = hero._id;
            if (!heroId) throw new Error("Hero ID is missing");

            const formData = new FormData();
            formData.append("nickname", form.nickname);
            formData.append("real_name", form.real_name);
            formData.append("origin_description", form.origin_description);
            formData.append("superpowers", form.superpowers);
            formData.append("catch_phrase", form.catch_phrase);

            files.forEach(file => formData.append("images", file));

            const updatedHero = await updateSuperhero(heroId, formData);
            onUpdate(updatedHero);
            onClose();
        } catch (err: any) {
            console.error("Error updating hero:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Update Superhero</h2>
                <form onSubmit={handleSubmit} className="edit-form">
                    <label>
                        Nickname:
                        <input type="text" name="nickname" value={form.nickname} onChange={handleChange} required />
                    </label>
                    <label>
                        Real Name:
                        <input type="text" name="real_name" value={form.real_name} onChange={handleChange} />
                    </label>
                    <label>
                        Origin Description:
                        <textarea name="origin_description" value={form.origin_description} onChange={handleChange} />
                    </label>
                    <label>
                        Superpowers:
                        <textarea name="superpowers" value={form.superpowers} onChange={handleChange} />
                    </label>
                    <label>
                        Catch Phrase:
                        <input type="text" name="catch_phrase" value={form.catch_phrase} onChange={handleChange} />
                    </label>

                    <label>
                        Add Images:
                        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                    </label>

                    {previewUrls.length > 0 && (
                        <div className="preview-container">
                            {previewUrls.map((url, idx) => (
                                <div key={idx} className="preview-item">
                                    <img src={url} alt={`preview-${idx}`} />
                                    <button type="button" onClick={() => handleRemoveFile(idx)}>🗑</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && <p className="form-error">{error}</p>}

                    <div className="form-buttons">
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HeroEditForm;
