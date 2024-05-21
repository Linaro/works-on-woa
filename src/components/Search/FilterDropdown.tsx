import "solid-js";
import {
  type Accessor,
  For,
  type JSX,
  type Resource,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import type { Filters, Results } from "./PageFind";
import type { CollectionEntry } from "astro:content";


type FilterKey = "auto_super_resolution.compatibility" | "category" | "compatibility";

const gameFilters: { key: FilterKey; name: string }[] = [
  { key: "auto_super_resolution.compatibility", name: "Auto SR" },
  { key: "category", name: "Category" },
  { key: "compatibility", name: "Compatibility" }
];

const FilterDropdown = ({
  search,
  setFilter,
  categories,
  type,
}: {
  type: "games";
  search: Accessor<{ query: string | null; filters: Filters }>;
  setFilter: (filter: string, selection: string, value: boolean) => void;
  categories: CollectionEntry<"games_categories">[];

}) => {
  const filters = gameFilters;

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
        filters.reduce(
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

  const options = createMemo(() => ({
    "auto_super_resolution.compatibility": ["yes, out-of-box", "yes, opt-in", "no", "unknown"],
    "category": categories.map((category) => category.data.name),
    "compatibility":
      type === "games"
        ? ["Perfect", "Playable", "Runs", "Unplayable"]
        : ["Native", "Emulation", "No", "Unknown"],
  }));

  return (
    <div class=" flex " ref={ref!}>
      <For each={filters}>
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
                  class="py-2 text-sm text-neutral-200 w-full  max-h-96 overflow-auto"
                  aria-labelledby="filter-button"
                >
                  <For each={options()[filter.key]}>
                    {(optionKey) => {
                      return (
                        <li class="flex flex-row w-full">
                          <button
                            type="button"
                            class="text-md text-left text-black hover:bg-neutral-300 hover:text-black w-full max-w-full "
                          >
                            <label
                              for={optionKey}
                              class="flex items-center ml-2 cursor-pointer h-full py-4 gap-3"
                            >
                              <input
                                type="checkbox"
                                name={optionKey}
                                id={optionKey}
                                data-option={filter.key}
                                onChange={onSelectFilterOption}
                                checked={search().filters[filter.key]?.includes(
                                  optionKey
                                )}
                                class="ml-2"
                              />
                              <span class="break-words">{`${optionKey}`}</span>
                            </label>
                          </button>
                        </li>
                      );
                    }}
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
