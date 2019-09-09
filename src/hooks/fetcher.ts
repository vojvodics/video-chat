import { useReducer, useEffect, Reducer } from 'react';

const FETCH_INIT = 'FETCH_INIT';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_FAILURE = 'FETCH_FAILURE';

interface State<T = any, E = any> {
  isLoading: boolean;
  error: E | null;
  data: T;
}

interface Action<T = any, E = any> {
  type: 'FETCH_INIT' | 'FETCH_SUCCESS' | 'FETCH_FAILURE';
  payload?: T;
  error?: E;
}

function dataFetchReducer(state: State, action: Action): State {
  switch (action.type) {
    case FETCH_INIT:
      return { ...state, isLoading: true, error: null };
    case FETCH_SUCCESS:
      return { ...state, isLoading: false, error: null, data: action.payload };
    case FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        data: action.payload || state.data,
      };
    default:
      throw new Error();
  }
}

// const delay = () => new Promise((r) => setTimeout(r, 1000));

// type MethodType<T, U> = (param: U) => PromiseLike<T>;
interface IOptions {
  resetOnFailure?: boolean;
}
// export function call<Fn extends (...args: any[]) => any>(fn: Fn, ...args: Parameters<Fn>): CallEffect

// TODO: types for arguments
export default function useDataApi<
  T = any,
  E = any,
  Fn extends (...args: any[]) => any = () => any
>(
  method: Fn,
  initialData: T,
  params: Parameters<Fn>,
  { resetOnFailure }: IOptions,
  paramsToWatch: any[],
) {
  const [state, dispatch] = useReducer<Reducer<State<T, E>, Action<T, E>>>(
    dataFetchReducer,
    {
      isLoading: false,
      error: null,
      data: initialData,
    },
  );

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: FETCH_INIT });
      try {
        const data = await method(params);
        if (!didCancel) {
          dispatch({ type: FETCH_SUCCESS, payload: data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({
            type: FETCH_FAILURE,
            error,
            payload: resetOnFailure ? initialData : undefined,
          });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, paramsToWatch);

  return [{ ...state }];
}
