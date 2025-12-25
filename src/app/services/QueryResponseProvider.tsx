import { FC, useContext, useState, useEffect, useMemo, createContext } from 'react'
import { useQuery } from 'react-query'
import { useQueryRequest } from './QueryRequestProvider'
import { stringifyRequestQuery, WithChildren } from '../../_metronic/helpers'

type QueryResponseContextProps = {
  isLoading: boolean
  refetch: () => void
  response: any
  query: string
}

// 📌 Lưu Context riêng theo namespace
const QueryResponseContextMap: { [key: string]: React.Context<QueryResponseContextProps> } = {}

const getOrCreateContext = (namespace: string) => {
  if (!QueryResponseContextMap[namespace]) {
    QueryResponseContextMap[namespace] = createContext<QueryResponseContextProps>({
      isLoading: false,
      refetch: () => { },
      response: null,
      query: '',
    })
  }
  return QueryResponseContextMap[namespace]
}

type QueryResponseProviderProps = {
  namespace: string
  fetchFunction: (query?: string) => Promise<any>
} & WithChildren

const QueryResponseProvider: FC<QueryResponseProviderProps> = ({
  namespace,
  fetchFunction,
  children,
}) => {
  const QueryResponseContext = getOrCreateContext(namespace)
  const { state } = useQueryRequest(namespace)

  const query = useMemo(() => stringifyRequestQuery(state), [state])

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery([namespace, query], () => fetchFunction(query), {
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  })

  const contextValue = useMemo(
    () => ({
      isLoading: isFetching,
      refetch,
      response,
      query,
    }),
    [isFetching, refetch, response, query]
  )

  return (
    <QueryResponseContext.Provider value={contextValue}>
      {children}
    </QueryResponseContext.Provider>
  )
}

// 📌 Hook chính
const useQueryResponse = (namespace: string) => {
  const QueryResponseContext = getOrCreateContext(namespace)
  return useContext(QueryResponseContext)
}

// 📌 Hook lấy dữ liệu bảng
const useQueryResponseData = (namespace: string) => {
  const { response } = useQueryResponse(namespace)
  return response?.Data ?? []
}

// 📌 Hook phân trang (ví dụ đang dùng kiểu TotalRow trong record đầu)
const useQueryResponsePagination = (namespace: string) => {
  const { response } = useQueryResponse(namespace)
  return {
    total: response?.Data?.[0]?.TotalRow ?? 0,
  }
}

// 📌 Hook loading
const useQueryResponseLoading = (namespace: string): boolean => {
  const { isLoading } = useQueryResponse(namespace)
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}