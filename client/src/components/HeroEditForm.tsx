import React, { useState } from "react";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (!hero) throw new Error("Hero is missing");

            const heroId = hero._id;
            if (!heroId) throw new Error("Hero ID is missing");

            const formData = new FormData();
            formData.append("nickname", form.nickname);
            formData.append("real_name", form.real_name);
            formData.append("origin_description", form.origin_description);
            formData.append("superpowers", form.superpowers);
            formData.append("catch_phrase", form.catch_phrase);
            formData.append("id", heroId);

            const updatedHero = await updateSuperhero(heroId, formData);
            onUpdate(updatedHero);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Редагувати героя</h2>
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

                    {error && <p className="form-error">{error}</p>}

                    <div className="form-buttons">
                        <button type="submit" disabled={loading}>Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HeroEditForm;
