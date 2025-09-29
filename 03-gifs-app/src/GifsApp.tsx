import { CustomHeader } from './shared/components/CustomHeader'
import { SearchBar } from './shared/components/SearchBar'
import { PreviousSearches } from './gifs/components/PreviousSearches'
import { GifList } from './gifs/components/GifList'
import { useState } from 'react'

import { getGifsByQuery } from './gifs/actions/get-gifs-by-query.action'
import type { Gif } from './gifs/interface/gif.interface'

export const GifsApp = () => {

    const [gifs, setGifs] = useState<Gif[]>([])
    const [previousTerms, setPreviousTerms] = useState<string[]>([])

    const handleTermClicked = (term: string) => {
        console.log({ term });
    };

    const handleSearch = async (query: string) => {
        query = query.trim().toLocaleLowerCase();

        if (query.length === 0) return;
        if (previousTerms.includes(query)) return;

        setPreviousTerms([query, ...previousTerms].splice(0, 8));

        const gifs = await getGifsByQuery(query);

        setGifs(gifs);

    }

    return (
        <>
            {/* Header */}
            <CustomHeader
                title='Buscador de gifs'
                description='Descubre y comparte el Gif perfecto'
            />

            {/* Search */}
            <SearchBar
                placeholder='Buscar Gif'
                buttonTitle='Buscar'
                onQuery={(query: string) => handleSearch(query)}
            />


            {/* Busquedas previas */}
            <PreviousSearches
                searches={previousTerms}
                onLabelClicked={handleTermClicked}
            />

            {/* Gifs */}
            <GifList gifs={gifs}
            />

        </>
    )
}
