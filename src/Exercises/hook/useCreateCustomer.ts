import { useMutation, useQueryClient } from "@tanstack/react-query"


export const createProduct = async (productData: any): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const shouldFail = Math.random() < 0.5;
    if (shouldFail) {
        const fakeErrorResponse = new Response(
            JSON.stringify({ message: 'Simulated server error: failed to create product' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        throw fakeErrorResponse;
    }

    const fakeResponse = new Response(
        JSON.stringify({
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...productData,
        }),
        {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        }
    );
    return fakeResponse.json();
};


export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,

        // 1. Optimistic update
        onMutate: async (newProduct) => {
            await queryClient.cancelQueries({ queryKey: ['product'] });

            const previousProducts = queryClient.getQueryData<any>(['product']);

            queryClient.setQueryData(['product'], (old: any) => {
                if (!Array.isArray(old)) return old;
                return [
                    { ...newProduct, id: 'temp-' + Date.now() },
                    ...old
                ];
            });

            return { previousProducts };
        },

        // 2. Error rollback
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(['product'], context?.previousProducts);
            alert("Thêm thất bại");
        },

        // 3. Refetch to get real data
        onSuccess: (newProduct) => {

            queryClient.setQueriesData({ queryKey: ['product'] }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                const newData = [...oldData, newProduct]
                return newData;
            });
            // queryClient.invalidateQueries({ queryKey: ['product'] });
            alert("Thêm thành công");
        },
    });
}
// custome
export const updateProduct = async (productData: any): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const shouldFail = Math.random() < 0.5;
    if (shouldFail) {
        // Bạn có thể ném Error hoặc Response tùy cách handle
        throw new Error(" Simulated server error: failed to update product");
    }

    // Trả về dữ liệu đã được cập nhật
    return {
        ...productData,
        updatedAt: new Date().toISOString(),
    };
};
export const customerUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onError: (error) => {
            console.error("Update error:", error);
            alert("update thất bại");
        },
        onSuccess: (updatedProduct) => {
            // Update cache for single item (if applicable)
            queryClient.setQueryData(['product', updatedProduct.id], updatedProduct);

            //  Update array cache for ['product'] list
            queryClient.setQueriesData({ queryKey: ['product'] }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;

                const newData = oldData.map((product: any) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                );

                return newData;
            });

            // queryClient.invalidateQueries({ queryKey: ['product'] })
            alert("update thành công");
        },
    });
};