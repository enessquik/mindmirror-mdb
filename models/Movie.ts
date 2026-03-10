import mongoose from 'mongoose';

export interface IMovie extends mongoose.Document {
  title: string;
  description: string;
  type: 'movie' | 'series';
  imdbId?: string;
  tmdbId?: string;
  year: number;
  duration?: string;
  seasons?: number;
  episodes?: number;
  genre: string[];
  category: string[];
  thumbnail: string;
  backdrop: string;
  trailer?: string;
  rating: number;
  views: number;
  featured: boolean;
  createdAt: Date;
}

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['movie', 'series'],
    required: true,
  },
  imdbId: String,
  tmdbId: String,
  year: {
    type: Number,
    required: true,
  },
  duration: String,
  seasons: Number,
  episodes: Number,
  genre: [String],
  category: [String],
  thumbnail: {
    type: String,
    required: true,
  },
  backdrop: {
    type: String,
    required: true,
  },
  trailer: String,
  rating: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
