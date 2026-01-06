import { Dispatch, SetStateAction } from 'react'
import { TableMeta } from '@tanstack/react-table';

// Mở rộng TableMeta để thêm tableId
declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    tableId?: string;
  }
}

export type ID = undefined | null | number

export type PaginationState = {
  pageSize?: 5 | 10 | 30 | 50 | 100
  offset: number
  total: number
}

export type SortState = {
  sort?: string
  order?: 'asc' | 'desc'
}

export type FilterState = {
  filter?: unknown
}

export type SearchState = {
  keySearch?: string
}

export type ProjectCodeState = {
  projectCode?: string | null
}

export type Response<T> = {
  Data?: T
}

export type QueryState = PaginationState & SortState & FilterState & SearchState & ProjectCodeState

export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

export const initialQueryState: QueryState = {
  pageSize: 10,
  offset: 0,
  total: 0, // Thêm giá trị mặc định cho total    
}

export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => { },
}

export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined
  refetch: () => void
  isLoading: boolean
  query: string
}

export const initialQueryResponse = { refetch: () => { }, isLoading: false, query: '' }

export type ListViewContextProps = {
  selected: Array<ID>
  onSelect: (selectedId: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  // NULL => (CREATION MODE) | MODAL IS OPENED
  // NUMBER => (EDIT MODE) | MODAL IS OPENED
  // UNDEFINED => MODAL IS CLOSED
  itemIdForUpdate?: ID
  setItemIdForUpdate: Dispatch<SetStateAction<ID>>
  isAllSelected: boolean
  disabled: boolean
}

export const initialListView: ListViewContextProps = {
  selected: [],
  onSelect: () => { },
  onSelectAll: () => { },
  clearSelected: () => { },
  setItemIdForUpdate: () => { },
  isAllSelected: false,
  disabled: false,
}
