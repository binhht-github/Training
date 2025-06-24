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


export function useCreateCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createProduct,
        onMutate: async (newProduct) => {
            // Cancel queries to prevent conflicts
            await queryClient.cancelQueries({ queryKey: ['customers'] })

            // Snapshot previous data
            const previousCustomers = queryClient.getQueryData(['customers'])

            // Optimistically update cache
            queryClient.setQueryData(['customers'], (old: any) => {
                if (!old) return old
                return {
                    ...old,
                    data: [{ ...newProduct, id: 'temp-' + Date.now() }, ...old.data],
                    totalItems: old.totalItems + 1
                }
            })

            return { previousCustomers }
        },
        onError: (err, newProduct, context) => {
            // Rollback on error
            queryClient.setQueryData(['customers'], context?.previousCustomers)
            alert("Thêm thất bại")
        },
        onSuccess: (customer) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            alert("Thêm thành công")
        },
    })
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

                console.log("Updated product list:", newData);
                return newData;
            });


            alert("update thành công");
        },
    });
};