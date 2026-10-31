import { create } from "zustand";
import { persist } from "zustand/middleware";


interface MovieStore {
  savedMovies: any[];
  setSavedMovies: (savedMovies: any[]) => void;
  removeSavedMovie: (id: string) => void;

  movieDetailsCache: Record<string, any>;
  setMovieDetails: (id: string, data: any) => void;

  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;

  searchPage: number;
  setSearchPage: (searchPage: number) => void;

  genres: any[];
  setGenres: (genres: any[]) => void;

  filters: {
    genreIds: number[];
    sortBy: string;
    year: number | null;
    minRating: number | null;
    maxRating: number | null;
  };
  setFilters: (filters: Partial<MovieStore["filters"]>) => void;
  resetFilters: () => void;
}
export const useMovieStore = create<MovieStore>()(
  persist(
    (set) => ({
      savedMovies: [],
      setSavedMovies: (savedMovies) => set({ savedMovies }),
      removeSavedMovie: (id) =>
        set((state) => ({
          savedMovies: state.savedMovies.filter((m) => m.id !== id),
        })),

      movieDetailsCache: {},
      setMovieDetails: (id, data) =>
        set((state) => ({
          movieDetailsCache: { ...state.movieDetailsCache, [id]: data },
        })),

      searchQuery: "",
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      searchPage: 1,
      setSearchPage: (searchPage) => set({ searchPage }),

      genres: [],
      setGenres: (genres) => set({ genres }),

      filters: {
        genreIds: [],
        sortBy: "popularity.desc",
        year: null,
        minRating: null,
        maxRating: null,
      },
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      resetFilters: () =>
        set({
          filters: {
            genreIds: [],
            sortBy: "popularity.desc",
            year: null,
            minRating: null,
            maxRating: null,
          },
        }),
    }),
    {
      name: "movie-mania-store",
      partialize: (state) => ({
        movieDetailsCache: state.movieDetailsCache,
      }),
    },
  ),
);


interface AuthState {
  userID: string | null;
  setUserID: (userID: string | null) => void;

  user: any;
  setUser: (user: any) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  userID: null,
  setUserID: (userID) => set({ userID }),

  user: null,
  setUser: (user) => set({ user }),

  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));
