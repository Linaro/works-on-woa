import "solid-js";
import {
  type Accessor,
  For,
  type JSX,
  type Resource,
  Show,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import type { Filters } from "./PageFind";

const filters = [
  { key: "category", name: "Category" },
  { key: "compatibility", name: "Compatibility" },
];

const gamesFilters = [
  { key: "compatibility", name: "Compatibility" },
  
];
const FilterDropdown = ({
  filterOptions,
  search,
  setFilter,
  results,
  type,
}: {
  filterOptions: Resource<any>;
  search: Accessor<{ query: string | null; filters: Filters }>;
  results: Resource<any>;
  setFilter: (filter: string, selection: string, value: boolean) => void;
  type: "games" | "applications"
}) => {
  const initialFilters = type === "games" ? gamesFilters : filters;
  
  
  const [showFilters, setShowFilters] = createSignal<Record<string, boolean>>(
     filters.reduce(
      (p, f) => ({
        ...p,
        [f.key]: false,
      }),
      {}
    )
  );
  
  
  const toggleFilters = (option: string) => {
    setShowFilters({
      ...Object.keys(showFilters()).reduce(
        (prev, k) => ({ ...prev, [k]: false }),
        {}
      ),
      [option]: !showFilters()[option] as boolean,
    });
  };

  let ref: HTMLDivElement;
  const handleClick = (event: MouseEvent) => {
    if (!ref.contains(event.target as Node)) {
      setShowFilters(
        initialFilters.reduce(
          (p, f) => ({
            ...p,
            [f.key]: false,
          }),
          {}
        )
      );
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClick);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClick);
  });

  const onSelectFilterOption: JSX.CustomEventHandlersCamelCase<HTMLInputElement>["onChange"] =
    (e) => {
      const option = e.currentTarget.dataset.option as string;
      const { checked, name } = e.currentTarget;
      setFilter(option, name, checked);
    };

  return (
    <div class=" flex" ref={ref!}>
      <For each={initialFilters}>
        {(filter) => (
          <div class="relative w-36 h-full flex-shrink-0 z-10 inline-flex text-sm font-medium text-center last:rounded-r-full first:rounded-l-full first:md:rounded-l-none  border-l  focus:ring-4 focus:outline-none  bg-neutral-700 hover:bg-neutral-600 focus:ring-neutral-700  text-white border-neutral-600">
            <button
              id={`filter-button-${filter.key}`}
              data-dropdown-toggle={`filter-button-${filter.key}`}
              type="button"
              class="py-2.5 px-4 h-full text-center w-full"
              onClick={() => toggleFilters(filter.key)}
            >
              {filter.name}
              {search().filters[filter.key]?.length > 0
                ? ` (${search().filters[filter.key].length})`
                : ""}
            </button>
            <Show when={showFilters()[filter.key]}>
              <div
                id={`filter-button-${filter.key}`}
                class="absolute block top-full z-10 left-0 right-auto md:right-0 md:left-auto divide-y mt-2 rounded-lg shadow w-44 md:w-64 bg-neutral-100 "
              >
                <ul
                  class="py-2 text-sm text-neutral-200 w-full "
                  aria-labelledby="filter-button"
                  role="listbox"
                >
                  <For each={Object.entries(filterOptions()[filter.key] || {})}>
                    {(filterOption) => (
                      <li class="flex flex-row w-full">
                        <button
                          type="button"
                          class="text-md text-left text-black hover:bg-neutral-300 hover:text-black w-full max-w-full "
                        >
                          <label
                            for={filterOption[0]}
                            class="flex items-center ml-2 cursor-pointer h-full  py-4 gap-3 "
                          >
                            <input
                              role="option"
                              type="checkbox"
                              name={filterOption[0]}
                              id={filterOption[0]}
                              data-option={filter.key}
                              onChange={onSelectFilterOption}
                              checked={
                                search().filters[filter.key] &&
                                search().filters[filter.key].includes(
                                  filterOption[0]
                                )
                              }
                              class="ml-2"
                            />
                            <span class="break-words">
                              {`${filterOption[0]} (${
                                results().filters[filter.key]
                                  ? results().filters[filter.key][
                                      filterOption[0]
                                    ]
                                  : filterOptions()[filter.key][filterOption[0]]
                              })`}
                            </span>
                          </label>
                        </button>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};

export default FilterDropdown;
