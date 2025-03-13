import "solid-js";
import {
  type Accessor,
  For,
  type JSX,
  Show,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import type { Filters } from "./PageFind";
import type { CollectionEntry } from "astro:content";
import { APPLICATION_COMPATIBILITY, GAME_AUTO_SR, GAME_COMPATIBILITY } from "../../config/enumerations";
import { t } from "i18next";
import { updateLanguage } from "../../util/updateLanguage";

type FilterKey = "auto_super_resolution.compatibility" | "category" | "compatibility";

function getGameFilters(): { key: FilterKey; name: string }[] {
  return [
      { key: "auto_super_resolution.compatibility", name: t('game_filters.auto_sr') },
      { key: "category", name: t('game_filters.category') },
      { key: "compatibility", name: t('game_filters.compatibility') }
  ];
}

function getApplicationFilters(): { key: FilterKey; name: string }[] {
  return [
      { key: "category", name: t('application_filters.category') },
  ];
}

const FilterDropdown = ({
  search,
  setFilter,
  categories,
  type,
}: {
  type: "games" | "applications";
  search: Accessor<{ query: string | null; filters: Filters }>;
  setFilter: (filter: string, selection: string, value: boolean) => void;
  categories: CollectionEntry<"games_categories" | "applications_categories">[];

}) => {
  const _ = updateLanguage(window.location);
  const filters = type === "applications" ? getApplicationFilters() : getGameFilters();

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

  const categoryValues = type === "games" ? "game_category_values" : "application_category_values";
  const options = createMemo(() => ({
    "auto_super_resolution.compatibility": GAME_AUTO_SR.map(item => t(`game_auto_sr_values.${item}`)),
    "category": categories.map((category) => t(`${categoryValues}.${category.slug}`)),
    "compatibility":
      type === "games"
        ? GAME_COMPATIBILITY.map(item => t(`game_compatibility_values.${item}`))
        : APPLICATION_COMPATIBILITY.map(item => t(`application_compatibility_values.${item}`))
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
