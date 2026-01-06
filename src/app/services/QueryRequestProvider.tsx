import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from 'react'
import {
  initialQueryRequest,
  QueryRequestContextProps,
  QueryState,
  WithChildren,
} from '../../_metronic/helpers'

// 📌 Sử dụng biến toàn cục để lưu các Context theo namespace
const QueryRequestContextMap: { [key: string]: React.Context<QueryRequestContextProps> } = {}

const getOrCreateContext = (namespace: string = 'default') => {
  if (!QueryRequestContextMap[namespace]) {
    QueryRequestContextMap[namespace] = createContext<QueryRequestContextProps>({
      state: { ...initialQueryRequest.state },
      updateState: () => { },
    })
  }
  return QueryRequestContextMap[namespace]
}

type QueryRequestProviderProps = {
  namespace?: string
  initialParams?: Partial<QueryState>
} & WithChildren

const QueryRequestProvider: FC<QueryRequestProviderProps> = ({
  namespace = 'default',
  initialParams,
  children,
}) => {
  const QueryRequestContext = getOrCreateContext(namespace)

  const initialState = useMemo(() => {
    return initialParams
      ? { ...initialQueryRequest.state, ...initialParams }
      : initialQueryRequest.state
  }, [initialParams])

  const [state, setState] = useState<QueryState>(initialState)

  //const isFirstRender = useRef(true)
  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false
  //     return
  //   }

  //   if (initialParams) {
  //     setState((prevState) => {
  //       const newState = { ...prevState, ...initialParams }
  //       return JSON.stringify(prevState) !== JSON.stringify(newState)
  //         ? newState
  //         : prevState
  //     })
  //   }
  // }, [initialParams])

  useEffect(() => {
    if (!initialParams) return

    setState((prev) => {
      const next = { ...prev, ...initialParams }
      return JSON.stringify(prev) !== JSON.stringify(next) ? next : prev
    })
  }, [initialParams])

  const updateState = useCallback(
    (updates: Partial<QueryState> | ((prev: QueryState) => QueryState)) => {
      setState((prev) =>
        typeof updates === 'function' ? updates(prev) : { ...prev, ...updates }
      )
    },
    []
  )

  return (
    <QueryRequestContext.Provider value={{ state, updateState }}>
      {children}
    </QueryRequestContext.Provider>
  )
}

// 📌 Hook để lấy state/updateState theo namespace
const useQueryRequest = (namespace: string = 'default') => {
  const QueryRequestContext = getOrCreateContext(namespace)
  return useContext(QueryRequestContext)
}

export { QueryRequestProvider, useQueryRequest }
