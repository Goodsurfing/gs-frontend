import { BASE_URL } from "../constants/api";

export const createLink = (uri: string) => `${BASE_URL}${uri.slice(1)}`;
