import { useRef, useState } from "react";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";
import type { Gif } from "../interface/gif.interface";

export const useGif = () => {
    const [gifs, setGifs] = useState<Gif[]>([])
    const [previousTerms, setPreviousTerms] = useState<string[]>([])
    const gifsCache = useRef<Record<string, Gif[]>>({})

    const handleTermClicked = async (term: string) => {
        if (gifsCache.current[term]) {
            setGifs(gifsCache.current[term]);
            return;
        }

        const gifs = await getGifsByQuery(term);
        setGifs(gifs);
    };

    const handleSearch = async (query: string) => {
        query = query.trim().toLocaleLowerCase();

        if (query.length === 0) return;

        if (previousTerms.includes(query)) return;

        setPreviousTerms([query, ...previousTerms].splice(0, 8));

        const gifs = await getGifsByQuery(query);

        setGifs(gifs);

        gifsCache.current[query] = gifs;

        console.log(gifsCache);
    }

    return {
        gifs,
        previousTerms,
        handleSearch,
        handleTermClicked,
    }
}
