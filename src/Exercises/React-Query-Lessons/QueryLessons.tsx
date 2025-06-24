
import axios from "axios"
import { useState } from "react";
import { useCustomQuery } from "../hook/useCustomQuery";
import { customerUpdate, useCreateCustomer } from "../hook/useCreateCustomer";

export type IProduct = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: ICategory;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
};

export type ICategory =
    | "men's clothing"
    | "women's clothing"
    | "jewelery"
    | "electronics";


const fetchProduct = async (filterCate: string) => {
    const res = await axios.get(`https://fakestoreapi.com/products${filterCate ? `/category/${filterCate}` : ""}`);
    return res.data;
};


const fetchCategories = async () => {
    const res = await axios.get('https://fakestoreapi.com/products/categories');
    return res.data;
};

export const QurreyLesson = () => {

    const [category, setCategory] = useState<string>("")


    const { data: products, isLoading: productLoading, isError: productIsError, error: productError } = useCustomQuery<IProduct[]>({
        queryKey: ['product'],
        queryFn: () => fetchProduct(category),
    })
    const { data: categories, isLoading: categoriesLoading, isError: categoriesIsError, error: categoriesError } = useCustomQuery<ICategory[]>({
        queryKey: ['categories'],
        queryFn: () => fetchCategories(),
    })

    console.log("product ", products);
    console.log(typeof products);


    if (productIsError || categoriesIsError) return <div>Lỗi tải trang {categoriesError?.message}{productError?.message}</div>

    return (
        <div className="w-full flex flex-col flex-1">
            <div className="m-5 flex justify-between">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">All Categories</option>
                    {(categories ?? []).map((ca: string) => (
                        <option key={ca} value={ca}>
                            {ca}
                        </option>
                    ))}
                </select>
                <div className="">
                    <UpdateCustomerForm />
                </div>
                <div className="">
                    <CreateCustomerForm />
                </div>
            </div>



            <div className="relative w-full flex-1 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4 ">
                {productLoading
                    ? <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                        <div className="text-gray-800 text-lg">Đang tải sản phẩm...</div>
                    </div>
                    : (products ?? []).map((pr) => (
                        <ProductCard key={pr.id} product={pr} />
                    ))
                }
            </div>
        </div>
    );
}

interface ProductCardProps {
    product: IProduct;
}


const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-sm transition hover:shadow-lg">
            <img
                src={product.image}
                alt={product.title}
                className="h-48 w-full object-contain mb-4"
            />
            <div className="text-sm text-gray-500 mb-1 capitalize">{product.category}</div>
            <h2 className="text-lg font-semibold mb-1 line-clamp-2">{product.title}</h2>
            <p className="text-gray-700 text-sm mb-2 line-clamp-3">{product.description}</p>
            <div className="flex items-center justify-between mt-2">
                <span className="text-blue-600 font-bold text-lg">${product.price}</span>
                <span className="text-sm text-yellow-500">
                    ⭐ {product.rating.rate} ({product.rating.count})
                </span>
            </div>
        </div>
    );
};



function CreateCustomerForm() {
    const createMutation = useCreateCustomer()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        try {
            await createMutation.mutateAsync({
                businessName: formData.get('businessName') as string,
                email: formData.get('email') as string,
                status: 'active'
            })
            // Reset form or redirect
        } catch (error) {
            // Error is handled in onError
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="businessName" placeholder="Business Name" required />
            <input name="email" type="email" placeholder="Email" required />
            <button
                type="submit"
                disabled={createMutation.isPending}
            >
                {createMutation.isPending ? 'Creating...' : 'Create Customer'}
            </button>
        </form>
    )
}

function UpdateCustomerForm() {
    const update = customerUpdate()

    const handleUpdate = () => {
        update.mutate(
            {
                "id": 1,
                "title": "UpdateProduct",
                "price": 55555,
                "description": "Update",
                "category": "men's clothing",
                "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                "rating": {
                    "rate": 0,
                    "count": 120
                }
            }
        )
    }

    return (
        <button onClick={handleUpdate}>Update click</button>
    )
}
