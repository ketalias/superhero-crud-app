export interface Superhero {
  _id: string;
  nickname: string;
  real_name?: string;
  origin_description?: string;
  superpowers?: string;
  catch_phrase?: string;
  images?: { url: string; public_id: string;}[];
}


export interface SuperheroesResponse {
  superheroes: Superhero[];
  totalPages: number;
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSuperheroes = async (page: number): Promise<SuperheroesResponse> => {
  const response = await fetch(`${API_BASE_URL}/superheroes?page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch superheroes");
  return response.json();
};

export const fetchSuperheroById = async (id: string): Promise<Superhero> => {
  const response = await fetch(`${API_BASE_URL}/superheroes/${id}`);
  if (!response.ok) throw new Error("Failed to fetch superhero");
  return response.json();
};

export const createSuperhero = async (data: FormData): Promise<Superhero> => {
  const response = await fetch(`${API_BASE_URL}/superheroes`, {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create superhero");
  }
  return response.json();
};

export const updateSuperhero = async (id: string, data: FormData): Promise<Superhero> => {
  const response = await fetch(`${API_BASE_URL}/superheroes/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update superhero");
  }
  return response.json();
};

export const deleteSuperhero = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/superheroes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete superhero");
  }
  return response.json();
};

export const deleteHeroImage = async (
  heroId: string,
  publicId: string
): Promise<{ message: string }> => {
  const encodedPublicId = encodeURIComponent(publicId);
  const response = await fetch(`${API_BASE_URL}/superheroes/${heroId}/image/${encodedPublicId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete image");
  }
  return response.json();
};
