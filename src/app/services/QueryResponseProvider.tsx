// import { FC, useContext, useState, useEffect, useMemo, createContext } from 'react'
// import { useQuery } from 'react-query'
// import { useQueryRequest } from './QueryRequestProvider'
// import { stringifyRequestQuery, WithChildren } from '../../_metronic/helpers'
// import { useAuth } from '../pages/Login'

// type QueryResponseContextProps = {
//   isLoading: boolean
//   refetch: () => void
//   response: any
//   query: string
// }

// // 📌 Lưu Context riêng theo namespace
// const QueryResponseContextMap: { [key: string]: React.Context<QueryResponseContextProps> } = {}

// const getOrCreateContext = (namespace: string) => {
//   if (!QueryResponseContextMap[namespace]) {
//     QueryResponseContextMap[namespace] = createContext<QueryResponseContextProps>({
//       isLoading: false,
//       refetch: () => { },
//       response: null,
//       query: '',
//     })
//   }
//   return QueryResponseContextMap[namespace]
// }

// type QueryResponseProviderProps = {
//   namespace: string
//   fetchFunction: (query?: string) => Promise<any>
// } & WithChildren

// const QueryResponseProvider: FC<QueryResponseProviderProps> = ({
//   namespace,
//   fetchFunction,
//   children,
// }) => {
//   const QueryResponseContext = getOrCreateContext(namespace)
//   const { state } = useQueryRequest(namespace)
//   const { auth } = useAuth()

//   /**
//    * 1️⃣ User có bị gán project không
//    */
//   const hasProjectAssigned = useMemo(() => {
//     if (!auth?.ProjectCodes) return false

//     if (Array.isArray(auth.ProjectCodes)) return auth.ProjectCodes.length > 0

//     if (typeof auth.ProjectCodes === 'string')
//       return auth.ProjectCodes.split(',').filter(Boolean).length > 0

//     return false
//   }, [auth?.ProjectCodes])

//   /**
//    * 2️⃣ Project đã sẵn sàng chưa
//    */
//   const isProjectReady = !hasProjectAssigned || !!auth?.SelectedProject

//   /**
//    * 3️⃣ stringify CHỈ KHI project ready
//    */
//   const query = useMemo(() => {
//     console.log('QueryResponseProvider - compute query1:');
//     if (!isProjectReady) return ''     // ⭐ CHỐT
//     return stringifyRequestQuery({
//       ...state,
//       projectCode: auth?.SelectedProject,
//     })
//   }, [state, auth?.SelectedProject, isProjectReady])

//   /**
//    * 4️⃣ useQuery chỉ chạy khi project ready
//    */
//   const {
//     isFetching,
//     refetch,
//     data: response,
//   } = useQuery(
//     [namespace, query],
//     () => fetchFunction(query),
//     {
//       enabled: isProjectReady && !!query,
//       staleTime: 30_000,
//       cacheTime: 5 * 60_000, // ⭐ BẮT BUỘC > 0
//       refetchOnMount: false,
//       refetchOnWindowFocus: false,
//       keepPreviousData: true,
//     }
//   )

//   const contextValue = useMemo(
//     () => ({
//       isLoading: isFetching,
//       refetch,
//       response,
//       query,
//     }),
//     [isFetching, refetch, response, query]
//   )

//   return (
//     <QueryResponseContext.Provider value={contextValue}>
//       {children}
//     </QueryResponseContext.Provider>
//   )
// }

// // 📌 Hook chính
// const useQueryResponse = (namespace: string) => {
//   const QueryResponseContext = getOrCreateContext(namespace)
//   return useContext(QueryResponseContext)
// }

// // 📌 Hook lấy dữ liệu bảng
// const useQueryResponseData = (namespace: string) => {
//   const { response } = useQueryResponse(namespace)
//   return response?.Data ?? []
// }

// // 📌 Hook phân trang (ví dụ đang dùng kiểu TotalRow trong record đầu)
// const useQueryResponsePagination = (namespace: string) => {
//   const { response } = useQueryResponse(namespace)
//   return {
//     total: response?.Data?.[0]?.TotalRow ?? 0,
//   }
// }

// // 📌 Hook loading
// const useQueryResponseLoading = (namespace: string): boolean => {
//   const { isLoading } = useQueryResponse(namespace)
//   return isLoading
// }

// export {
//   QueryResponseProvider,
//   useQueryResponse,
//   useQueryResponseData,
//   useQueryResponsePagination,
//   useQueryResponseLoading,
// }

import {
  FC,
  useContext,
  useMemo,
  createContext,
} from 'react'
import { useQuery } from 'react-query'
import { useQueryRequest } from './QueryRequestProvider'
import { stringifyRequestQuery, WithChildren } from '../../_metronic/helpers'
import { useAuth } from '../pages/Login'

/* ===================== TYPES ===================== */

type QueryResponseContextProps = {
  isLoading: boolean
  refetch: () => void
  response: any
  query: string
}

/* ===================== CONTEXT MAP ===================== */

// Lưu context theo namespace (multi table / multi page)
const QueryResponseContextMap: {
  [key: string]: React.Context<QueryResponseContextProps>
} = {}

const getOrCreateContext = (namespace: string) => {
  if (!QueryResponseContextMap[namespace]) {
    QueryResponseContextMap[namespace] =
      createContext<QueryResponseContextProps>({
        isLoading: false,
        refetch: () => { },
        response: null,
        query: '',
      })
  }
  return QueryResponseContextMap[namespace]
}

/* ===================== PROVIDER ===================== */

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
  const { auth } = useAuth()

  /**
   * 1️⃣ User có được gán project không
   */
  const hasProjectAssigned = useMemo(() => {
    if (!auth?.ProjectCodes) return false

    if (Array.isArray(auth.ProjectCodes)) {
      return auth.ProjectCodes.length > 0
    }

    if (typeof auth.ProjectCodes === 'string') {
      return auth.ProjectCodes.split(',').filter(Boolean).length > 0
    }

    return false
  }, [auth?.ProjectCodes])

  /**
   * 2️⃣ Project đã sẵn sàng chưa
   * - Không có project → luôn ready
   * - Có project → phải chọn SelectedProject
   */
  const isProjectReady = useMemo(
    () => !hasProjectAssigned || !!auth?.SelectedProject,
    [hasProjectAssigned, auth?.SelectedProject]
  )

  /**
   * 3️⃣ Build query (CHỈ khi project ready)
   */
  const query = useMemo(() => {
    if (!isProjectReady) return ''

    return stringifyRequestQuery({
      ...state,
      projectCode: auth?.SelectedProject,
    })
  }, [state, auth?.SelectedProject, isProjectReady])

  /**
   * 4️⃣ Fetch data
   */
  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    [namespace, query],
    () => fetchFunction(query),
    {
      enabled: isProjectReady && !!query,
      staleTime: 30_000,
      cacheTime: 5 * 60_000,
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )

  /**
   * 5️⃣ Context value
   */
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

/* ===================== HOOKS ===================== */

// Hook chính
const useQueryResponse = (namespace: string) => {
  const QueryResponseContext = getOrCreateContext(namespace)
  return useContext(QueryResponseContext)
}

// Lấy data bảng
const useQueryResponseData = (namespace: string) => {
  const { response } = useQueryResponse(namespace)
  return response?.Data ?? []
}

// Phân trang (TotalRow ở record đầu)
const useQueryResponsePagination = (namespace: string) => {
  const { response } = useQueryResponse(namespace)
  return {
    total: response?.Data?.[0]?.TotalRow ?? 0,
  }
}

// Loading
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
