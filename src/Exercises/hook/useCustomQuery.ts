// hooks/useCustomQuery.ts
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

export function useCustomQuery<TQueryFnData, TError = Error, TData = TQueryFnData>
    (
        options: UseQueryOptions<TQueryFnData, TError, TData>
    ): UseQueryResult<TData, TError> {
    return useQuery({
        staleTime: 1000 * 60 * 5, // mặc định 5 phút
        refetchOnWindowFocus: false,
        retry: 1,
        refetchOnReconnect: true,
        ...options, // ghi đè nếu truyền vào khác
    });
}
