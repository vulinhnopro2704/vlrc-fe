export interface ListItem<T> {
  items: T[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface ListItemRequestParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ResponseError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
