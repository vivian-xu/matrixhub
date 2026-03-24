import {
  startTransition,
  useCallback,
  useMemo,
  useState,
} from 'react'

import type { MRT_RowSelectionState } from 'mantine-react-table'

interface RouteListSearchState {
  page?: number
  query?: string
}

interface UseRouteListStateOptions<TSearch extends RouteListSearchState, TRecord> {
  search: TSearch
  navigate: (options: {
    replace?: boolean
    search: (prev: TSearch) => TSearch
  }) => unknown
  records: readonly TRecord[]
  getRecordId: (record: TRecord) => string
  refresh?: () => unknown
  defaultPage?: number
  normalizeQuery?: (value: string) => string | undefined
}

const DEFAULT_PAGE = 1

function defaultNormalizeQuery(value: string) {
  const nextQuery = value.trim()

  return nextQuery.length > 0 ? nextQuery : undefined
}

export function useRouteListState<TSearch extends RouteListSearchState, TRecord>({
  search,
  navigate,
  records,
  getRecordId,
  refresh,
  defaultPage = DEFAULT_PAGE,
  normalizeQuery = defaultNormalizeQuery,
}: UseRouteListStateOptions<TSearch, TRecord>) {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  const currentRecordIds = useMemo(
    () => new Set(records.map(record => getRecordId(record))),
    [getRecordId, records],
  )

  const clearRowSelection = useCallback(() => {
    setRowSelection({})
  }, [])

  const selectedRowIds = useMemo(
    () => Object.keys(rowSelection).filter(
      rowId => !!rowSelection[rowId] && currentRecordIds.has(rowId),
    ),
    [currentRecordIds, rowSelection],
  )

  const selectedCount = selectedRowIds.length
  const currentQuery = normalizeQuery(search.query ?? '')

  const onSearchChange = useCallback((value: string) => {
    const nextQuery = normalizeQuery(value)

    if (nextQuery === currentQuery) {
      return
    }

    clearRowSelection()
    void navigate({
      replace: true,
      search: prev => ({
        ...prev,
        page: defaultPage,
        query: nextQuery,
      }),
    })
  }, [clearRowSelection, currentQuery, defaultPage, navigate, normalizeQuery])

  const onRefresh = useCallback(() => {
    clearRowSelection()
    void refresh?.()
  }, [clearRowSelection, refresh])

  const onPageChange = useCallback((page: number) => {
    if (page === (search.page ?? defaultPage)) {
      return
    }

    clearRowSelection()
    startTransition(() => {
      void navigate({
        search: prev => ({
          ...prev,
          page,
        }),
      })
    })
  }, [clearRowSelection, defaultPage, navigate, search.page])

  return {
    rowSelection,
    setRowSelection,
    clearRowSelection,
    selectedCount,
    selectedRowIds,
    onSearchChange,
    onRefresh,
    onPageChange,
  }
}
