import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSuperheroById, deleteSuperhero, deleteHeroImage } from "../services/api";
import type { Superhero } from "../services/api";
import HeroEditForm from "../components/HeroEditForm";


const HeroDetail: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hero, setHero] = useState<Superhero | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const getHero = async () => {
            setLoading(true);
            setError(null);
            try {
                if (id) {
                    const data = await fetchSuperheroById(id);
                    setHero(data);
                    setCurrentImageIndex(0);
                } else {
                    console.error("No hero ID provided");
                }
            } catch (err: any) {
                console.error("Error fetching hero:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getHero();
    }, [id]);

    const handlePrev = () => {
        if (!hero) return;
        setCurrentImageIndex(prev =>
            prev === 0 ? (hero.images?.length ?? 1) - 1 : prev - 1
        );
    };

    const handleNext = () => {
        if (!hero) return;
        setCurrentImageIndex(prev =>
            prev === (hero.images?.length ?? 1) - 1 ? 0 : prev + 1
        );
    };

    const handleDeleteHero = async () => {
        if (!id) return;
        if (window.confirm("Ви дійсно хочете видалити цього героя?")) {
            await deleteSuperhero(id);
            navigate("/");
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!id || !imageId || !images[currentImageIndex]) {
            console.error("Invalid hero ID or image ID");
            return;
        }
        if (window.confirm("Are you sure?")) {
            try {
                await deleteHeroImage(id, imageId);
                setHero(prev => {
                    if (!prev) return prev;
                    return { ...prev, images: prev.images?.filter(img => img.public_id !== imageId) };
                });
                setCurrentImageIndex(0);
            } catch (err: any) {
                console.error("Failed to delete image:", err.message);
                setError(err.message);
                const data = await fetchSuperheroById(id);
                setHero(data);
            }
        }
    };

    if (loading) return <div className="status">Loading...</div>;
    if (error) return <div className="status error">{error}</div>;
    if (!hero) return <div className="status">Hero not found</div>;

    const images = hero.images ?? [];

    return (
        <div className="hero-detail">
            <div className="hero-content">
                <div className="carousel">
                    {images.length > 0 ? (
                        <div className="carousel-container">
                            <img
                                src={images[currentImageIndex].url}
                                alt={`${hero.nickname} ${currentImageIndex}`}
                                className="hero-image"
                            />
                            <button onClick={handlePrev} className="carousel-btn prev">◀</button>
                            <button onClick={handleNext} className="carousel-btn next">▶</button>
                            <button
                                onClick={() => handleDeleteImage(images[currentImageIndex].public_id)}
                                className="delete-image-btn"
                            >
                                🗑
                            </button>
                        </div>
                    ) : (
                        <p>No Image</p>
                    )}
                </div>

                <div className="hero-info">
                    <div className="nickname">{hero.nickname}</div>
                    {hero.real_name && <p><strong>Real Name:</strong> {hero.real_name}</p>}
                    {hero.origin_description && <p><strong>Origin:</strong> {hero.origin_description}</p>}
                    {hero.superpowers && <p><strong>Superpowers:</strong> {hero.superpowers}</p>}
                    {hero.catch_phrase && <p><strong>Catch Phrase:</strong> "{hero.catch_phrase}"</p>}

                    <div className="hero-actions">
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>Update</button>
                        <button onClick={handleDeleteHero} className="delete-btn">Delete</button>
                    </div>
                    {isEditing && hero && (
                        <HeroEditForm
                            hero={hero}
                            onClose={() => setIsEditing(false)}
                            onUpdate={(updatedSuperhero: Superhero) => setHero(updatedSuperhero)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroDetail;
