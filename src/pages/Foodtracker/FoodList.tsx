import FoodItemComponent from "../../components/Foodtracker/listItems/FoodItemComponent.tsx";
import FoodItemSkeleton from "../../components/Foodtracker/listItems/FoodItemSkeleton.tsx";
import { useOutletContext } from "react-router-dom";
import type { FoodPageContext } from "./FoodPage.tsx";


export interface Nutriments {
  "energy-kcal_100g"?: number;
  "carbohydrates_100g"?: number;
  "proteins_100g"?: number;
  "fat_100g"?: number;
  "sugars_100g"?: number;
  "fiber_100g"?: number;
  "sodium_100g"?: number;
}
export interface searchItem {
  id: string;
  product_name: string;
  nutriments: Nutriments;
  code: string;
  brands: string;
}
export default function FoodList() {
  const {
    product,
    productBarcode,
    recents,
    setRecents,
    loading,
    error,
    Searching,
    barcode,
    getStatusMessage,
  } = useOutletContext<FoodPageContext>();

  return (
    <>
      {!loading && !Searching && !error && recents.length > 0 && !productBarcode ? (
        <div className="">
          <div className="text-textcolor text-center my-4 font-semibold">Recent searches</div>
          {recents.map((item) => (
            <FoodItemComponent
              key={item.id}
              name={item.product_name}
              nutriments={item.nutriments}
              barcode={item.code}
              brand={item.brands}
              onClick={() => {
                if (!recents.includes(item)) {
                  setRecents([...recents, item]);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mb-20">
          {loading ? (
            <>
              {[...Array(5)].map((_, index) => (
                <FoodItemSkeleton key={index} />
              ))}
            </>
          ) : (
            <>
              {(() => {
                const status = getStatusMessage();
                return status ? (
                  <div className={`${status.css} text-center text-textcolor my-6`}>
                    {status.text}
                  </div>
                ) : null;
              })()}

              {product.map((item) => (
                item.nutriments ?
                <FoodItemComponent
                  key={item.id ?? item.code}
                  name={item.product_name}
                  nutriments={item.nutriments}
                  barcode={item.code}
                  brand={item.brands}
                  onClick={() => {
                    if (!recents.includes(item)) {
                      setRecents([...recents, item]);
                    }
                  }}
                />
                : null
                ))}
                
                {productBarcode ? 
                <FoodItemComponent key={1} name={productBarcode.product_name} nutriments={productBarcode.nutriments} barcode={barcode.toString()} brand={productBarcode.brands_tags[0]} onClick={()=> null}/>
              : null  
              }
            </>
          )}
        </div>
      )}
    </>
  );
}