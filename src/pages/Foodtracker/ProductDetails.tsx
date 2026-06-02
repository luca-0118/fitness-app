import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface ProductMetric {
    label: string;
    value: number;
    unit: string;
    color: string;
}

interface DatabaseFoodItem {
    id: number;
    name: string;
    amount: number;
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
    barcode: string;
    date: string;
}

export default function ProductDetails() {
    const location = useLocation();
    const { id } = location.state || {}; // Retrieve the id from the state
    const [product, setProduct] = useState<DatabaseFoodItem | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch product details based on the id
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const result = await invoke<DatabaseFoodItem>("get_product_by_barcode", { id });
                setProduct(result);
            } catch (err) {
                console.error("Error fetching product details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    // Define metrics based on the product data
    const metrics: ProductMetric[] = product
        ? [
            { label: "Calories", value: product.calories, unit: "kcal", color: "#F67631" },
            { label: "Carbs", value: product.carbs, unit: "g", color: "#DC143C" },
            { label: "Proteins", value: product.protein, unit: "g", color: "#4DA3FF" },
            { label: "Fats", value: product.fats, unit: "g", color: "#32CD32" },
            { label: "Sugar", value: 0, unit: "g", color: "#FFD700" }, // Placeholder, adjust as needed
            { label: "Fiber", value: 0, unit: "g", color: "#9153cc" }, // Placeholder, adjust as needed
            { label: "Sodium", value: 0, unit: "mg", color: "#FF4500" }, // Placeholder, adjust as needed
        ]
        : [
            { label: "Calories", value: 0, unit: "kcal", color: "#F67631" },
            { label: "Carbs", value: 0, unit: "g", color: "#DC143C" },
            { label: "Proteins", value: 0, unit: "g", color: "#4DA3FF" },
            { label: "Fats", value: 0, unit: "g", color: "#32CD32" },
            { label: "Sugar", value: 0, unit: "g", color: "#FFD700" },
            { label: "Fiber", value: 0, unit: "g", color: "#9153cc" },
            { label: "Sodium", value: 0, unit: "mg", color: "#FF4500" },
        ];

    const caloriesMetric = metrics.find((item) => item.label === "Calories");
    const otherMetrics = metrics.filter((item) => item.label !== "Calories");

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="fixed inset-0 top-15 bottom-15 bg-[#161818] z-20 overflow-y-auto px-5 py-5 no-scrollbar">
            <div className="w-full max-w-md mx-auto bg-[#1E1E1E] border border-[#414141] rounded-xl p-5">
                <h1 className="text-white text-xl font-bold mb-4">Product Details</h1>

                <div className="grid grid-cols-3 gap-2">
                    {caloriesMetric && (
                        <div
                            key={caloriesMetric.label}
                            style={{ borderColor: caloriesMetric.color }}
                            className="col-span-3 border-2 rounded-xl p-3"
                        >
              <span style={{ color: caloriesMetric.color, display: "block" }} className="font-semibold">
                {caloriesMetric.label}
              </span>
                            <div className="inline-flex items-baseline">
                                <span className="text-white text-lg font-bold">{caloriesMetric.value}</span>
                                <span className="text-[15px] text-white">{caloriesMetric.unit}</span>
                            </div>
                        </div>
                    )}
                    {otherMetrics.map((item) => (
                        <div
                            key={item.label}
                            style={{ borderColor: item.color }}
                            className="border-2 rounded-xl p-5 min-h-[92px] flex flex-col items-center justify-center"
                        >
              <span style={{ color: item.color, display: "block" }} className="font-semibold">
                {item.label}
              </span>
                            <div className="inline-flex items-baseline">
                                <span className="text-white text-lg font-bold">{item.value}</span>
                                <span className="text-[15px] text-white">{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-md mx-auto mt-5 bg-[#1E1E1E] border border-[#414141] rounded-xl p-5">
                <h2 className="text-white text-lg font-bold mb-3">Additional info</h2>
                <p className="text-white text-sm">
                    barcode: {product?.barcode || "N/A"} <br />
                    brand: {product?.name || "N/A"} <br />
                </p>
            </div>

            <div className="w-full max-w-md mx-auto mt-5 bg-[#1E1E1E] border border-[#414141] rounded-xl p-5">
                <h2 className="text-white text-lg font-bold mb-3">Daily progression</h2>
                <input
                    type="text"
                    placeholder="0"
                    className="bg-[#1E1E1E] text-white placeholder:text-gray-500 border border-[#414141] rounded-xl p-2 w-25 focus:outline-none focus:ring-2 focus:ring-[#F67631]"
                />
                <select
                    defaultValue="gr"
                    className="bg-[#1E1E1E] text-white border border-[#414141] rounded-xl p-2 w-32 focus:outline-none focus:ring-2 focus:ring-[#F67631] ml-3"
                >
                    <option value="kg">kg</option>
                    <option value="gr">gr</option>
                    <option value="mg">mg</option>
                </select>
            </div>

            <div className="w-full max-w-md mx-auto mt-5">
                <button className="cursor-pointer mx-auto sticky bottom-2 h-16 justify-center items-center font-bold w-[90%] rounded-full bg-[#F67631] hover:bg-[#FF9962] active:bg-[#FF9962] flex z-30">
                    Add product
                </button>
            </div>
        </div>
    );
}