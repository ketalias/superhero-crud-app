import mongoose, { Document, Schema, Model } from "mongoose";

export interface IImage {
  url: string;
  public_id: string;
}

export interface ISuperhero extends Document {
  nickname: string;
  real_name?: string;
  origin_description?: string;
  superpowers?: string;
  catch_phrase?: string;
  images: IImage[];
}

const ImageSchema: Schema<IImage> = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const SuperheroSchema: Schema<ISuperhero> = new Schema({
  nickname: { type: String, required: true, unique: true },
  real_name: { type: String },
  origin_description: { type: String },
  superpowers: { type: String },
  catch_phrase: { type: String },
  images: { type: [ImageSchema], default: [] },
});

export const Superhero: Model<ISuperhero> = mongoose.model<ISuperhero>(
  "Superhero",
  SuperheroSchema
);
