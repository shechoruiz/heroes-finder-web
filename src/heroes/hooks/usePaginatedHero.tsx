import { useQuery } from "@tanstack/react-query";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

// TanstackQuery es una libreria que nos permite manejar el "estado del servidor" de una manera mas sencilla, simplificando la logica de caché, estados de carga y error y reintentos de peticiones asíncronas.

export const usePaginatedHero = (
  page: number,
  limit: number,
  category: string = "all",
) => {
  return useQuery({
    // TanskstackQuery utiliza el queryKey para cachear los datos. Con esto el sabe cuando una peticion es nueva y no devuelve el cache de antes
    // Cuando la funcion que esta dentro de tankstackQuery recibe argumentos, estos argumentos tienen que ser parte de la queryKey
    queryKey: ["heroes", { page, limit, category }],
    queryFn: () => getHeroesByPageAction(page, limit, category),
    // El staleTime es el tiempo en milisegundos que se mantendra el cache de la peticion
    staleTime: 1000 * 60 * 5,
  });
};
