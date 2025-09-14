import React, { useState, useEffect } from 'react';
import { fetchSuperheroes } from '../services/api';
import type { Superhero } from '../services/api';
import SuperheroCard from './HeroCard';

const HeroesList: React.FC = () => {
    const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getHeroes = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchSuperheroes(page);
                setSuperheroes(data.superheroes);
                setTotalPages(data.totalPages);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getHeroes();
    }, [page]);



    const handleNextPage = () => page < totalPages && setPage(page + 1);
    const handlePrevPage = () => page > 1 && setPage(page - 1);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="heroes-list">
            <h1>Superheroes List</h1>
            <div className="heroes-line">
                {superheroes.map(hero => (
                    <SuperheroCard key={hero._id} hero={hero} />
                ))}
            </div>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>previous</button>
                <span> Сторінка {page} з {totalPages} </span>
                <button onClick={handleNextPage} disabled={page === totalPages}>next</button>
            </div>
        </div>
    );
};

export default HeroesList;