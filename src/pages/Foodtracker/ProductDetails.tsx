import { useLocation } from "react-router-dom";

interface ProductMetric {
    label: string;
    value: number;
    unit: string;
    color: string;
}

export default function ProductDetails() {
    const location = useLocation();
    const product = location.state;

    const metrics: ProductMetric[] = product
        ? [
            { label: "Calories", value: Math.round(product.calories), unit: "kcal", color: "#F67631" },
            { label: "Carbs", value: Math.round(product.carbs), unit: "g", color: "#DC143C" },
            { label: "Proteins", value: Math.round(product.protein), unit: "g", color: "#4DA3FF" },
            { label: "Fats", value: Math.round(product.fats), unit: "g", color: "#32CD32" },
        ]
        : [
            { label: "Calories", value: 0, unit: "kcal", color: "#F67631" },
            { label: "Carbs", value: 0, unit: "g", color: "#DC143C" },
            { label: "Proteins", value: 0, unit: "g", color: "#4DA3FF" },
            { label: "Fats", value: 0, unit: "g", color: "#32CD32" },
        ];

    const caloriesMetric = metrics.find((item) => item.label === "Calories");
    const otherMetrics = metrics.filter((item) => item.label !== "Calories");

    return (
        <div className="fixed inset-0 top-15 bottom-15 bg-background z-20 overflow-y-auto px-5 py-5 no-scrollbar">
            <div className="w-full max-w-md mx-auto bg-components border border-bordercolor rounded-xl p-5">
                <h1 className="text-textcolor text-xl font-bold mb-4">{product?.name || "N/A"}</h1>
                    <div className="grid grid-cols-3 gap-2">
                        {caloriesMetric && (
                            <div
                                key={caloriesMetric.label}
                                style={{ borderColor: caloriesMetric.color }}
                                className="col-span-3 border-2 rounded-xl p-3 text-center justify-center"
                            >
                            <span style={{ color: caloriesMetric.color }} className="font-semibold block">
                                {caloriesMetric.label}
                            </span>
                                <div className="inline-flex items-baseline">
                                    <span className="text-textcolor text-lg font-bold">{caloriesMetric.value}</span>
                                    <span className="text-[15px] text-textcolor">{caloriesMetric.unit}</span>
                                </div>
                            </div>
                        )}
                        {otherMetrics.map((item) => (
                            <div
                                key={item.label}
                                style={{ borderColor: item.color }}
                                className="border-2 rounded-xl p-5 min-h-23 flex flex-col items-center justify-center"
                            >
                            <span style={{ color: item.color }} className="font-semibold block">
                                {item.label}
                            </span>
                                <div className="inline-flex items-baseline">
                                    <span className="text-textcolor text-lg font-bold">{item.value}</span>
                                    <span className="text-[15px] text-textcolor">{item.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto mt-5 bg-components border border-bordercolor rounded-xl p-5">
                <h2 className="text-textcolor text-lg font-bold mb-3">Additional info</h2>
                <p className="text-textcolor text-sm">
                    amount: {product?.amount || "N/A"}g <br />
                    barcode: {product?.barcode || "N/A"} <br />
                    date: {product?.date || "N/A"} <br />
                </p>
            </div>
        </div>
    );
}