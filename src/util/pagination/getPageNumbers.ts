const visiblePages = 10;
export const getPageNumbers = (
  paginationList: number[],
  currentPage: number,
  total: number
) => {
  const offset = visiblePages / 2;
  if (currentPage <= offset) {
    return paginationList.slice(0, 10);
  }

  if (currentPage + offset > total) {
    return paginationList.slice(total - visiblePages, total);
  }
  return paginationList.slice(currentPage - (offset + 1), currentPage + offset);
};
