import { useQueries, useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchProduct = async () => {
    const res = await axios.get('https://fakestoreapi.com/products');
    return res.data;
};

const fetchCategories = async () => {
    const res = await axios.get('https://fakestoreapi.com/products/categories');
    return res.data;
};

export const QurreyLesson = () => {
    // const { data: product, isLoading, isError, error } = useQuery({
    //     queryKey: ['product'],      // key cho caching
    //     queryFn: fetchProduct,      // hàm gọi API
    // });
    // const { data: categories, isLoading, isError, error } = useQuery({
    //     queryKey: ['categories'],      // key cho caching
    //     queryFn: fetchCategories,      // hàm gọi API
    // });

    const results = useQueries({
        queries: [
            {
                queryKey: ['user'],
                queryFn: () => fetchProduct(),
            },
            {
                queryKey: ['posts'],
                queryFn: () => fetchCategories(),
            },
        ],
    });

    // const productQuery = results[0]
    const { data: products, isLoading: productLoading, isError: productIsError, error: productError } = results[0]
    const { data: categories, isLoading: categoriesLoading, isError: categoriesIsError, error: categoriesError } = results[1]

    if (productLoading || categoriesLoading) return <div>Loading...... </div>
    if (productIsError || categoriesIsError) return <div>Lỗi tải trang {categoriesError?.message}{productError?.message}</div>
    return (
        <div className="w-full h-10 flex bg-red-400">
            <div className="bg-green-400">
                <select name="" id="">
                    <option value="">Categories</option>
                    {categories.map((ca: string) => {
                        return (
                            <option key={ca} value={ca}>{ca}</option>
                        )
                    })}
                </select>
            </div>
            <div className="bg-blue-400">

            </div>
        </div>
    )
}