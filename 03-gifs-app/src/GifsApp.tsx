import { CustomHeader } from './shared/components/CustomHeader'
import { SearchBar } from './shared/components/SearchBar'
import { PreviousSearches } from './gifs/components/PreviousSearches'
import { GifList } from './gifs/components/GifList'
import { useGif } from './gifs/hooks/useGif'


export const GifsApp = () => {


    const { gifs, previousTerms, handleSearch, handleTermClicked } = useGif();

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
