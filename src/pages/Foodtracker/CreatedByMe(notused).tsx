// import { useOutletContext, useNavigate } from "react-router-dom";
// import FoodItemComponent from "../../components/Foodtracker/listItems/FoodItemComponent.tsx";
// import from { FoodPageContext, searchItem} "./FoodPage.tsx"

// const customFoods: searchItem[] = [
//     {
//         id: "custom-1",
//         product_name: "Banana Bread",
//         nutriments: {
//             "energy-kcal_100g": 270,
//             "carbohydrates_100g": 45,
//             "proteins_100g": 4.5,
//             "fat_100g": 9,
//             "sugars_100g": 22,
//             "fiber_100g": 2.5,
//             "sodium_100g": 0.34,
//         },
//         code: "000000000001",
//         brands: "Home Made",
//     },
//     {
//         id: "custom-2",
//         product_name: "Protein Pancake",
//         nutriments: {
//             "energy-kcal_100g": 210,
//             "carbohydrates_100g": 24,
//             "proteins_100g": 18,
//             "fat_100g": 6,
//             "sugars_100g": 5,
//             "fiber_100g": 3,
//             "sodium_100g": 0.28,
//         },
//         code: "000000000002",
//         brands: "Kitchen Fit",
//     },
//     {
//         id: "custom-3",
//         product_name: "Avocado Toast",
//         nutriments: {
//             "energy-kcal_100g": 160,
//             "carbohydrates_100g": 17,
//             "proteins_100g": 4,
//             "fat_100g": 9,
//             "sugars_100g": 1.2,
//             "fiber_100g": 4.7,
//             "sodium_100g": 0.24,
//         },
//         code: "000000000003",
//         brands: "Custom Meal",
//     },
// ];

// export default function CreatedByMe() {
//     const { searchText } = useOutletContext<FoodPageContext>();
//     const navigate = useNavigate();
    
//     const filteredFood = customFoods.filter((item) =>
//         item.product_name.toLowerCase().includes(searchText.toLowerCase())
//     );

//     return (
//         <div className="">
//         {filteredFood.length > 0 ? (
//         filteredFood.map((item) => (
//             <FoodItemComponent
//                 key={item.id}
//                 name={item.product_name}
//                 nutriments={item.nutriments}
//                 barcode={item.code}
//                 brand={item.brands}
//                 onClick={() => null}
//             />
//         ))
//         ) : (
//         <div className="text-center text-textcolor mt-10">
//             No custom foods match "{searchText}".
//         </div>
//         )}
//         <nav className="text-center text-textcolor mt-10">
//             <button onClick={() => navigate("/create-meal")}>Create meal</button>
//         </nav>
//     </div>
//     );
// }
