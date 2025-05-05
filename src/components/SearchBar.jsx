import { useItems } from "../context/ItemContext";

const SearchBar = () => {
    const { setSearchQuery } = useItems();

    return (
        <div className="mb-8 max-w-2xl mx-auto">
            <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200"
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;