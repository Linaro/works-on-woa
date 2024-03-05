import "solid-js";
import { Show, createEffect, createMemo, createResource, createSignal } from "solid-js";
import FilterDropdown from "./FilterDropdown";
import Results from "./Results";
import SearchIcon from "./SearchIcon";
import ClearIcon from "./ClearIcon";
import type { JSX } from "solid-js/h/jsx-runtime";
import { getCollection } from "astro:content";
const bundlePath = `${import.meta.env.BASE_URL}_pagefind/`;
const pagefind = await import(/* @vite-ignore */ `${bundlePath}pagefind.js`);

export type Filters = Record<string, string[]>;

export type SearchQuery = { query: string | null; filters: Filters };

const fetchResults = async ({
  query,
  filters,
}: {
  query: string | null;
  filters: Filters;
}) => {
  return await pagefind.search(query, {
    filters,
    sort: query
      ? undefined
      : {
          name: "asc",
        },
  });
};

const fetchFilterOptions = async () => {
  return await pagefind.filters();
};

const getQueryParams = ({ filters, query }: SearchQuery) => {
  const url = new URL(window.location.origin);
  if (query) url.searchParams.append("query", query);
  if (filters.category?.length > 0) {
    url.searchParams.append("category", filters.category.join(","));
  }
  if (filters.compatibility?.length > 0) {
    url.searchParams.append("compatibility", filters.compatibility.join(","));
  }
  return url;
};

const PageFind = ({ shouldRedirect, type }: { shouldRedirect: boolean, type: "games" | "applications" }) => {
  const pathParams = createMemo(() => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    return {
      query: url.searchParams.get("query"),
      category: url.searchParams.get("category")?.split(","),
      compatibility: url.searchParams.get("compatibility")?.split(","),
    };
  });

  const [search, setSearch] = createSignal<{
    query: string | null;
    filters: Filters;
  }>({
    query: pathParams().query || null,
    filters: {
      category: pathParams().category || [],
      compatibility: pathParams().compatibility || [],
      type: [type]
    },
  });

  const setFilter: (
    filter: string,
    selection: string,
    value: boolean
  ) => void = (filter, selection, value) => {
    const prev = search();
    console.log(filter, selection, value);

    const prevFilter = prev.filters[filter] || [];
    const newSearch = {
      ...prev,
      filters: {
        ...prev.filters,
        [filter]: [
          ...prevFilter.filter(
            (item) => (value && item === selection) || item !== selection
          ),
          ...(value ? [selection] : []),
        ],
      },
    };
    setSearch(newSearch);
    setRequest(newSearch);
    const url = getQueryParams(search());
    if (!shouldRedirect) window.history.replaceState({}, "", url.toString());
  };

  const clearSearch = () => {
    setSearch({
      query: null,
      filters: {
        type: [type]
      },
      
    });
    setRequest({
      query: null,
      filters: {
        type: [type]
      },
    });
  };

  const [request, setRequest] = createSignal<{
    query: string | null;
    filters: Filters;
  }>({
    query: pathParams().query || null,
    filters: {
      category: pathParams().category || [],
      compatibility: pathParams().compatibility || [],
      type: [type]
    },
  });

  const onSearch: JSX.CustomEventHandlersCamelCase<HTMLFormElement>["onSubmit"] =
    (e) => {
      e.preventDefault();
      const url = getQueryParams(search());
      if (shouldRedirect) {
        window.location.href = url.toString();
        return;
      }
      window.history.replaceState({}, "", url.toString());
      setRequest(search());
    };

  const [results] = createResource(request, fetchResults);
  const [filterOptions] = createResource(request, fetchFilterOptions);


  return (
    <div class={`w-full flex flex-col h-[${results()?.length || 10 * 7}rem]`}>
      <div class="w-full flex flex-col md:flex-row justify-between items-stretch mb-3 gap-3 md:gap-0">
        <form
          onSubmit={onSearch}
          class="bg-white text-black basis-11/12 rounded-full md:rounded-r-none flex flex-row py-2 px-1 items-center pl-6"
        >
          <label class="hidden" for="project-search">
            Search for applications
          </label>
          { type === "applications" ? 
          <input
            placeholder="Search for applications"
            name="project-search"
            value={search().query || ""}
            onInput={(e) =>
              setSearch({
                ...search(),
                query: e.currentTarget.value || null,
              })
            }
            class="w-full h-full px-3"
          /> : 
          <input
            placeholder="Search for games"
            name="project-search"
            value={search().query || ""}
            onInput={(e) =>
              setSearch({
                ...search(),
                query: e.currentTarget.value || null,
              })
            }
            class="w-full h-full px-3"
          />}
          
          <button
            class="py-2 px-2 flex items-center"
            type="submit"
            aria-label="Submit search query"
          >
            <SearchIcon />
          </button>
          <button
            class="py-2 px-2"
            onClick={clearSearch}
            aria-label="Clear search query"
          >
            <ClearIcon />
          </button>
        </form>

        <div class="flex">
          <FilterDropdown
            type={type}
            search={search}
            filterOptions={filterOptions}
            setFilter={setFilter}
            results={results}
          />
        </div>
      </div>
      <Show when={!shouldRedirect}>
        <Results
          results={results}
          search={search}
          clearSearch={clearSearch}
          setFilter={setFilter}
          type={type}
        />
      </Show>
    </div>
  );
};

export default PageFind;
