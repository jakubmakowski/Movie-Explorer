import { createContext, Dispatch, ReactNode, SetStateAction } from "react";

export interface APIContextProviderProps {
  children: ReactNode;
}

type APIContextTypes = {
  movies: any;
  setMovies: Dispatch<SetStateAction<boolean>>;
};

const defaultAPIContext: APIContextTypes = {
  movies: false,
  setMovies: () => {},
};

export const APIContext = createContext<APIContextTypes>(defaultAPIContext);
