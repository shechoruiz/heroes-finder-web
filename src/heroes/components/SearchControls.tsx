import React, { useRef } from "react";
import { Search, Filter, SortAsc, Grid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

// Los `value` son los valores reales del backend (seed de nest-heroes-backend);
// los `label` son lo que ve el usuario
const FILTERS = [
  {
    param: "team",
    label: "Equipo",
    allLabel: "Todos los equipos",
    options: [
      { value: "Liga de la Justicia", label: "Liga de la Justicia" },
      { value: "Vengadores", label: "Vengadores" },
      { value: "X-Men", label: "X-Men" },
      { value: "Batfamilia", label: "Batfamilia" },
      { value: "Jóvenes Titanes", label: "Jóvenes Titanes" },
      { value: "Solo", label: "Solo" },
      { value: "Suicide Squad", label: "Escuadrón Suicida" },
    ],
  },
  {
    param: "category",
    label: "Categoría",
    allLabel: "Todas las categorías",
    options: [
      { value: "Hero", label: "Héroe" },
      { value: "Villain", label: "Villano" },
    ],
  },
  {
    param: "universe",
    label: "Universo",
    allLabel: "Todos los universos",
    options: [
      { value: "DC", label: "DC" },
      { value: "Marvel", label: "Marvel" },
    ],
  },
  {
    param: "status",
    label: "Estado",
    allLabel: "Todos los estados",
    options: [
      { value: "Active", label: "Activo" },
      { value: "Deceased", label: "Fallecido" },
    ],
  },
] as const;

interface FilterSelectProps {
  param: string;
  label: string;
  allLabel: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (param: string, value: string) => void;
}

const FilterSelect = ({
  param,
  label,
  allLabel,
  options,
  value,
  onChange,
}: FilterSelectProps) => {
  // useId asocia el label con el select (accesibilidad: lectores de pantalla
  // y testing-library getByLabelText dependen de la asociación explícita)
  const selectId = React.useId();

  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(param, e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const SearchControls = () => {
  // Usamos en esta caso un useRef en vez de useState porque no necesitamos controlar el estado de la busqueda, lo que evita también que haya un re-render por cada tecleo
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const activeAccordion = searchParams.get("active-accordion") ?? "";
  const selectedStrength = Number(searchParams.get("strength") ?? "0");

  const setQueryParams = (name: string, value: string) => {
    setSearchParams((prev) => {
      prev.set(name, value);
      return prev;
    });
  };

  const removeQueryParams = (...names: string[]) => {
    setSearchParams((prev) => {
      names.forEach((paramName) => prev.delete(paramName));
      return prev;
    });
  };

  const handleSearch = () => {
    const value = inputRef.current?.value.trim() ?? "";

    if (value) {
      setQueryParams("name", value);
    } else {
      removeQueryParams("name");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Limpia el filtro `name` de la URL cuando el usuario vacía el input
  const handleInputChange = () => {
    if (inputRef.current?.value === "") {
      removeQueryParams("name");
    }
  };

  const handleSelectChange = (param: string, value: string) => {
    if (value === "") {
      removeQueryParams(param);
    } else {
      setQueryParams(param, value);
    }
  };

  const handleClearAll = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    removeQueryParams(
      "name",
      "team",
      "category",
      "universe",
      "status",
      "strength",
    );
  };

  return (
    <>
      {/* Controls */}
      <section className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar héroes, villanos, poderes, equipos..."
            className="pl-12 pr-12 h-12 text-lg bg-white"
            ref={inputRef}
            defaultValue={name}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            aria-label="Buscar"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant={
              activeAccordion === "advance-filters" ? "default" : "outline"
            }
            className="h-12"
            onClick={() => {
              if (activeAccordion === "advance-filters") {
                // setQueryParams("active-accordion", "");
                setSearchParams((prev) => {
                  prev.delete("active-accordion");
                  return prev;
                });
                return;
              }
              setQueryParams("active-accordion", "advance-filters");
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <Button variant="outline" className="h-12 bg-white">
            <SortAsc className="h-4 w-4 mr-2" />
            Ordenar por nombre
          </Button>

          <Button variant="outline" className="h-12 bg-white">
            <Grid className="h-4 w-4" />
          </Button>

          {/* Oculto: el área administrativa (/admin) está desactivada en el router */}
          {/* <Button className="h-12" onClick={handleAddCharacter}>
            <Plus className="h-4 w-4 mr-2" />
            Add Character
          </Button> */}
        </div>
      </section>

      {/* Advanced Filters */}
      <Accordion type="single" collapsible value={activeAccordion}>
        <AccordionItem value="advance-filters">
          {/* <AccordionTrigger>Is it accessible?</AccordionTrigger> */}
          <AccordionContent>
            <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filtros avanzados</h3>
                <Button variant="ghost" onClick={handleClearAll}>
                  Limpiar todo
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {FILTERS.map((filter) => (
                  <FilterSelect
                    key={filter.param}
                    param={filter.param}
                    label={filter.label}
                    allLabel={filter.allLabel}
                    options={filter.options}
                    value={searchParams.get(filter.param) ?? ""}
                    onChange={handleSelectChange}
                  />
                ))}
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">
                  Fuerza mínima: {selectedStrength}/10
                </label>
                <div className="relative flex w-full touch-none select-none items-center mt-2">
                  <Slider
                    value={[selectedStrength]}
                    onValueChange={(value) =>
                      setQueryParams("strength", value[0].toString())
                    }
                    max={10}
                    step={1}
                  />
                </div>
              </div>
            </section>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
