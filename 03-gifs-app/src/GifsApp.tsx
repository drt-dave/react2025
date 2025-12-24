import { CustomHeader } from './shared/components/CustomHeader'
import { SearchBar } from './shared/components/SearchBar'
import { PreviousSearches } from './gifs/components/PreviousSearches'
import { GifList } from './gifs/components/GifList'
import { useGif } from './gifs/hooks/useGif'

export const GifsApp = () => {
    const {
        gifs,
        previousTerms,
        handleSearch,
        handleTermClicked
    } = useGif();

    return (
        <>
            <CustomHeader
                title='Buscador de gifs'
                description='Descubre y comparte el Gif perfecto'
            />

            <SearchBar
                placeholder='Buscar Gif'
                buttonTitle='Buscar'
                onQuery={(query: string) => handleSearch(query)}
            />

            <PreviousSearches
                searches={previousTerms}
                onLabelClicked={handleTermClicked}
            />

            <GifList
                gifs={gifs}
            />
        </>
    )
}
