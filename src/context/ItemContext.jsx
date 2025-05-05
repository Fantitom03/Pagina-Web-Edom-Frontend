import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Asegúrate de importar el contexto de autenticación
import api from '../api/edomApi';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const { user } = useAuth(); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1, totalPages: 1, total: 0, limit: 12, hasMore: true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '', minPrice: '', maxPrice: ''
  });

  // Función principal para obtener items con parámetros de filtrado
  const getItems = useCallback(
    async ({ page = 1, q = '', category = '', minPrice = '', maxPrice = '' } = {}, reset = false) => {
      if (!user) return; // <<-- bail out si no estamos autenticados
      setLoading(true);
      setError(null);

      try {
        // siempre usamos /items/search
        const params = { page, limit: pagination.limit, q, category, minPrice, maxPrice };

        console.log('🚀 llamando /items/search con', params);
        const { data } = await api.get('/items/search', { params });

        // desestructura items y pagination del body
        const fetched = data.items || [];
        const pag = data.pagination || {};

        // reemplaza o concatena + dedupe
        setItems(prev => {
          if (reset) return fetched;
          const map = new Map();
          prev.forEach(i => map.set(i._id, i));
          fetched.forEach(i => map.set(i._id, i));
          return Array.from(map.values());
        });

        // actualiza paginación
        const p = pag.page || 1;
        const tp = pag.totalPages || 1;
        const t = pag.total || 0;
        const lim = pag.limit != null ? pag.limit : pagination.limit;
        setPagination({
          page: p,
          totalPages: tp,
          total: t,
          limit: lim,
          hasMore: p < tp
        });
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError(err.response?.data?.message || 'Error cargando productos');
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );
    
  // cada vez que cambien búsqueda o filtros, recarga desde página 1
  useEffect(() => {
    if (user) {
      getItems({
        page: 1,
        q: searchQuery,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice
      }, true);
    }
  }, [searchQuery, filters.category, filters.minPrice, filters.maxPrice, getItems]);

  // infinite scroll idéntico a antes…
  useEffect(() => {
    if (!user) return;
    const sentinel = document.getElementById('infinite-loader');
    if (!sentinel) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && pagination.hasMore) {
        getItems({
          page: pagination.page + 1,
          q: searchQuery,
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        }, false);
      }
    }, { rootMargin: '200px' });
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [loading, pagination, searchQuery, filters, getItems]);

  // CRUD individuales
  const getItem = useCallback(async id => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/items/${id}`);
      return data;
    } catch (err) {
      console.error('Error al obtener el producto:', err);
      setError(err.response?.data?.message || 'Error cargando el producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async data => {
    setLoading(true);
    setError(null);
    try {
      const { data: item } = await api.post('/items', data);
      setItems(prev => [item, ...prev]);
      return item;
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setError(err.response?.data?.message || 'Error creando producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: updated } = await api.put(`/items/${id}`, data);
      setItems(prev => prev.map(i => i._id === id ? updated : i));
      return updated;
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      setError(err.response?.data?.message || 'Error actualizando producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async id => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/items/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
      setError(err.response?.data?.message || 'Error eliminando producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para depuración
  const debugFilters = () => {
    console.log('Estado actual de filtros:', {
      searchQuery,
      filters,
      pagination
    });
  };

  return (
    <ItemContext.Provider value={{
      items, loading, error, pagination,
      searchQuery, filters,
      setSearchQuery, setFilters,
      getItems, getItem, createItem, updateItem, deleteItem,
      debugFilters
    }}>
      {children}
      <div id="infinite-loader" style={{ height: '20px', margin: '20px 0' }} />
    </ItemContext.Provider>
  );
};

export const useItems = () => useContext(ItemContext);