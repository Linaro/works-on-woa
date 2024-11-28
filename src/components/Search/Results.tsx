import "solid-js";
import dayjs from "dayjs";
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  type Accessor,
  type Resource,
  type Setter,
} from "solid-js";
import Pagination from "./Pagination";
import type { JSX } from "solid-js/h/jsx-runtime";
import type { SearchQuery } from "./PageFind";
import i18next, { t, changeLanguage } from "i18next";
import { updateLanguage } from "../../util/updateLanguage";

const getProject = async (result: any) => {
  return await result.data();
};

const locale = updateLanguage(window.location);
const PAGE_SIZE = 10;

const AutoSRFormatMap: {[key: string]: string} = {
  "yes, out-of-box" : "Yes, out-of-box",
  "yes, opt-in": "Yes, opt-in",
  "no": "No",
  "unknown" : "Unknown"
}

const formartAutoSR = (x: string) => {
  return AutoSRFormatMap[x]
}

const Result = ({
  result,
  onClickFilterLink,
  type,
}: {
  result: any;
  onClickFilterLink: JSX.CustomEventHandlersCamelCase<HTMLButtonElement>["onClick"];
  type: "applications" | "games";

}) => {
  const [project] = createResource(result, getProject);
  return (
    <Show when={!!project()} fallback={<div class="min-h-24" />}>
      <li class="flex flex-col sm:flex-row bg-white bg-opacity-10 text-white rounded-md mb-2 no-underline min-h-28">
        <article class="flex flex-row items-center ">
          <div class="m-5 w-[50px]">
            <a href={project().url.slice(0, -1)} class="cursor-pointer">
              <img
                src={project().meta.image}
                class="max-h-[50px] min-w-[50px] mx-auto"
                height="50px"
                width="50px"
                alt={`${project().name} logo`}
              />
            </a>
          </div>
          <div class="border-l border-gray-500 flex-grow">
            <a href={project().url} class="cursor-pointer">
              <h2 class="font-bold text-lg md:text-xl p-3 ">
                {project()?.meta.title}
              </h2>
            </a>

            <div class="px-3 flex flex-col sm:flex-row gap-3 mb-3 flex-wrap">

              <Show when={type === "applications"}>
                <Switch fallback={
                  <p class="text-red-500 flex flex flex-col sm:flex-row gap-1 flex-wrap">
                    {project().filters.compatibility[0]}
                  </p>
                }>
                  <Match when={project().filters.compatibility[0] === 'Compatible'}>
                    <p class="text-green-500 flex flex-col sm:flex-row gap-1 flex-wrap">
                      <span class="pr-2">✓</span>{" "}
                      {project().filters.compatibility[0]}
                    </p>
                  </Match>
                  <Match when={project().filters.compatibility[0] === 'Compatible via Web Browser'}>
                    <p class="text-green-500 flex flex-col sm:flex-row gap-1 flex-wrap">
                      <span class="pr-2">✓</span>{" "}
                      {project().filters.compatibility[0]}
                    </p>
                  </Match>
                  <Match when={project().filters.compatibility[0] === 'Vendor Announced - Launching Soon'}>
                    <p class="text-green-500 flex flex-col sm:flex-row gap-1 flex-wrap">
                      {project().filters.compatibility[0]}
                    </p>
                  </Match>
                </Switch>

              </Show>

              <Show when={type === "games"}>
              <p class="flex gap-2 flex-wrap">
                <b>{t('games.categories')}: </b>
                <span class="flex flex-wrap gap-1">
                  <For each={project().filters.category}>
                    {(cat: string) => (
                      <button
                        class="text-blue-300 underline after:content-[','] last:after:content-[''] inline"
                        data-filter-type="category"
                        data-filter-selection={cat}
                        onClick={onClickFilterLink}
                      >
                        {cat}
                      </button>
                    )}
                  </For>
                </span>
              </p>
              </Show>

              <Show when={type === "applications"}>
                <p class="break-all text-orange-200">
                  <b>{t('applications.version_from')}:&nbsp;</b>
                  <span class="min-w-0">{project()?.meta.version_from}</span>
                </p>
              </Show>

              <Show when={type === "applications"}>
              <p class="flex gap-2 flex-wrap">
                <b>{t('applications.categories')}: </b>
                <span class="flex flex-wrap gap-1">
                  <For each={project().filters.category}>
                    {(cat: string) => (
                        <span class="inline">
                          {cat}
                        </span>
                    )}
                  </For>
                </span>
              </p>
              </Show>

              <Show when={type === "games"}>
                <p>
                  <b>{t('games.compatibility')}: </b>
                  <span class="min-w-0 text-orange-200">
                    {project().filters.compatibility}
                  </span>
                </p>
                <p>
                  <b>{t('games.auto_sr')}: </b>
                  <span>{formartAutoSR(project()?.filters["auto_super_resolution.compatibility"]) ?? "Unknown" }</span>
                </p>
                <Show when={project()?.meta.date_tested != null}>
                  <p>
                    <b>{t('games.date_tested')}: </b>
                    <span>
                      {dayjs(project()?.meta.date_tested).format("DD-MMM-YYYY")}
                    </span>
                  </p>
                </Show>
              </Show>
            </div>
          </div>
        </article>
        <a
          class="p-5 text-5xl text-blue-500 cursor-pointer align-middle hidden flex-grow-0 sm:block sm:flex-grow text-right"
          href={project().url}
        >
          »
        </a>
      </li>
    </Show>
  );
};

const Results = ({
  page,
  setPage,
  results,
  search,
  clearSearch,
  setFilter,
  type,
  searchRun,
}: {
  page: Accessor<number>;
  setPage: Setter<number>;
  results: Resource<any>;
  search: Accessor<SearchQuery>;
  clearSearch: () => void;
  setFilter: (filter: string, selection: string, value: boolean) => void;
  type: "applications" | "games";
  searchRun: Accessor<Number>
}) => {
  const [paginatedResults, setPaginatedResults] = createSignal<any>([]);

  const pageCount = createMemo(() => {
    const totalResults = results()?.results.length;
    if (totalResults % PAGE_SIZE === 0) {
      return totalResults / PAGE_SIZE;
    } else {
      return Math.ceil(totalResults / PAGE_SIZE);
    }
  });

  createEffect(() => {
    setPaginatedResults(
      results()?.results.slice((page() - 1) * PAGE_SIZE, page() * PAGE_SIZE)
    );
  });

  createEffect(() => {
    const url = new URL(window.location.href);
    if (page() === 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", page().toString());
    }
    window.history.replaceState({}, "", url.toString());
  });

  const onClickFilterLink: JSX.CustomEventHandlersCamelCase<HTMLButtonElement>["onClick"] =
    (e) => {
      const filter =
        e.target.attributes.getNamedItem("data-filter-type")!.value;
      const selection = e.target.attributes.getNamedItem(
        "data-filter-selection"
      )!.value;
      clearSearch();
      setFilter(filter, selection, true);
    };

    return (
    <div class={`w-full my-6`}>
      <Switch>
        <Match when={results.loading}>
        <Show
            when={
              search().query !== null ||
              search().filters?.category?.length > 0
            }
          >
            <div class="w-full flex flex-col items-center gap-3 p-10 ">
              Loading results...
            </div>
          </Show>
        </Match>

        <Match when={results().results.length > 0}>
          <div class="flex flex-col">
            <ul>
              <For each={paginatedResults()}>
                {(result) => (
                  <Result
                    result={result}
                    type={type}
                    onClickFilterLink={onClickFilterLink}
                  />
                )}
              </For>
            </ul>
            <Pagination
              page={page}
              pageCount={pageCount}
              setPage={setPage}
              total={results()?.results.length}
            />
          </div>
        </Match>

        <Match when={ 
                      results().results.length === 0 &&
                      searchRun() === 1
                    }>
          <div class="w-full flex flex-col items-center gap-3 p-10">
            <p class="text-center text-xl mb-2">
              {t('search.no_information_start')} <a class="underline text-blue-500" href={`/${locale}/contributing`}>{t('search.no_information_here')}</a> {t('search.no_information_end')}
            </p>
            <button
              class="px-10 py-2 bg-white hover:bg-slate-300 border-white text-black font-bold border rounded-full"
              onClick={clearSearch}>
              {t('search.clear_search')}
            </button>
          </div>
        </Match>

        <Match
          when={
            search().query === null &&
            search().filters?.category?.length === 0
          }
        >
          <p class="text-center text-xl">
            {t('applications.search_instruction')}
          </p>
        </Match>

      </Switch>
    </div>
  );
};

export default Results;
