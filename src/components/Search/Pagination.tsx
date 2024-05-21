import {
  For,
  type Accessor,
  type Setter,
  type JSX,
  createMemo,
  Show,
} from "solid-js";
import {
  FiChevronRight,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronsLeft,
} from "solid-icons/fi";
const visiblePages = 5;
const PAGE_SIZE = 10;

export const getPageNumbers = (currentPage: number, total: number) => {
  const offset = Math.floor(visiblePages / 2);
  if (total < visiblePages) {
    return Array.from({ length: Number(total) }, (_, i) => i + 1);
  }
  if (currentPage <= offset) {
    return Array.from({ length: Number(visiblePages) }, (_, i) => i + 1);
  }

  if (currentPage + offset > total) {
    return Array.from(
      { length: Number(visiblePages) },
      (_, i) => i + total + 1 - visiblePages
    );
  }
  return Array.from(
    { length: Number(visiblePages) },
    (_, i) => i + (currentPage - offset)
  );
};

const Pagination = ({
  pageCount,
  page,
  setPage,
  total,
}: {
  page: Accessor<number>;
  pageCount: Accessor<number>;
  setPage: Setter<number>;
  total: number;
}) => {
  const onClickPageNumber: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = (e) => {
    const pageNumber = e.target.attributes.getNamedItem("data-page-number")
      ?.value as unknown as number;
    setPage(Number(pageNumber));
  };

  const onNextPage: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    setPage(page() + 1);
  };

  const onPrevPage: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    setPage(page() - 1);
  };

  const onJumpForward: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    setPage(page() + 10 > pageCount() ? pageCount() : page() + 10);
  };

  const onJumpBack: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    setPage(page() - 10 < 1 ? 1 : page() - 10);
  };

  const onLastPage: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    setPage(pageCount());
  };

  const onFirstPage: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    setPage(1);
  };

  const pageNumbers = createMemo(() => getPageNumbers(page(), pageCount()));
  return (
    <nav class="flex flex-col w-full items-center gap-16 my-4 self-end">
      <ul class="flex items-center flex-wrap h-10 text-base">
        <Show when={pageCount() > 1 && page() > 1}>
          <li>
            <button
              onClick={onFirstPage}
              class="pagination-button rounded-l-lg"
            >
              <span>First</span>
            </button>
          </li>
          <li>
            <button onClick={onJumpBack} class="pagination-button">
              <span class="sr-only">Jump forward 10 pages</span>
              <FiChevronsLeft />
            </button>
          </li>
          <li>
            <button onClick={onPrevPage} class="pagination-button ">
              <span class="sr-only">Previous</span>
              <FiChevronLeft />
            </button>
          </li>
        </Show>
        <For each={pageNumbers()}>
          {(pageNumber: number) => (
            <li>
              <button
                data-page-number={pageNumber}
                onClick={onClickPageNumber}
                classList={{
                  ["bg-neutral-700 text-white font-bold"]:
                    page() === pageNumber,
                }}
                class="pagination-button"
              >
                {pageNumber}
              </button>
            </li>
          )}
        </For>
        <Show when={pageCount() > 1 && page() < pageCount()}>
          <li>
            <button onClick={onNextPage} class="pagination-button">
              <span class="sr-only">Next</span>

              <FiChevronRight />
            </button>
          </li>
          <li>
            <button onClick={onJumpForward} class="pagination-button">
              <span class="sr-only">Jump forward 10 pages</span>
              <FiChevronsRight />
            </button>
          </li>
          <li>
            <button onClick={onLastPage} class="pagination-button rounded-r-lg">
              <span>Last</span>
            </button>
          </li>
        </Show>
      </ul>
      <p class="text-sm text-neutral-300 block">
        <Show
          when={total > 10}
          fallback={
            <span>
              <span class="font-semibold text-white ">{total}</span> result
              {total > 1 ? "s" : ""}
            </span>
          }
        >
          <span class="font-semibold text-white ">
            {(page() - 1) * PAGE_SIZE + 1}
          </span>{" "}
          to{" "}
          <span class="font-semibold text-white ">
            {page() * PAGE_SIZE > total ? total : page() * PAGE_SIZE}
          </span>{" "}
          of <span class="font-semibold text-white ">{total}</span> results
        </Show>
      </p>
    </nav>
  );
};
export default Pagination;
