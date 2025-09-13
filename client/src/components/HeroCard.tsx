import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Superhero } from '../services/api';

interface SuperheroCardProps {
  hero: Superhero;
}

const SuperheroCard: React.FC<SuperheroCardProps> = ({ hero }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/heroes/${hero.id}`);
  };
  const imageSrc = typeof hero.image === 'string' ? hero.image : hero.image?.url;

  return (
    <div className="superhero-card" onClick={handleClick}>
      {imageSrc ? (
        <img src={imageSrc} alt={hero.nickname} width={100} />
      ) : (
        <p>No Image</p>
      )}
      <h3>{hero.nickname}</h3>
    </div>
  );
};

export default SuperheroCard;