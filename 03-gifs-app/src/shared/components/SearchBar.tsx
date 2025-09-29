import { KeyboardEvent, useEffect, useState } from "react";
interface Props {
    placeholder: string;
    buttonTitle: string;
    onQuery: (query: string) => void;
}
export const SearchBar = ({ placeholder = 'Buscar', buttonTitle, onQuery }: Props) => {

    const [query, setQuery] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onQuery(query)
        }, 700);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [query, onQuery])

    // función callback para comunicar info de hijo a padre
    const handleSearch = () => {
        onQuery(query);
    };


    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>{buttonTitle} </button>
        </div>
    )
}
