export type TPagination = {
  current: number;
  totalPages: number;
  total: number;
};

export type TPaginationQuery = {
  page: number;
  limit: number;
  search?: string;
};
