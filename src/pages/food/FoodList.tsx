import FoodItemComponent from "../../components/food/FoodItemComponent.tsx";
import SearchBar from "../../components/SearchBar.tsx";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

interface Nutriments {
  "energy-kcal_100g"?: number;
  "carbohydrates_100g"?: number;
  "proteins_100g"?: number;
  "fat_100g"?: number;
  "sugars_100g"?: number;
  "fiber_100g"?: number;
  "sodium_100g"?: number;
}

interface searchItem {
  id: string;
  product_name: string;
  nutriments: Nutriments;
  code: string;
  brands: string;
}
interface searchReturn {
  page: string;
  page_count: number;
  page_size: number;
  products: searchItem[];
  skip: number;
}
//pls work github

const MOCK_RECENTS: searchItem[] = [
  {
    id: "1",
    product_name: "Banana",
    code: "5901234567890",
    brands: "Generic",
    nutriments: {
      "energy-kcal_100g": 89,
      "carbohydrates_100g": 23,
      "proteins_100g": 1.1,
      "fat_100g": 0.3,
      "sugars_100g": 12,
      "fiber_100g": 2.6,
      "sodium_100g": 0.001,
    },
  },
  {
    id: "2",
    product_name: "Chicken Breast",
    code: "1234567890123",
    brands: "Tyson",
    nutriments: {
      "energy-kcal_100g": 165,
      "carbohydrates_100g": 0,
      "proteins_100g": 31,
      "fat_100g": 3.6,
      "sugars_100g": 0,
      "fiber_100g": 0,
      "sodium_100g": 0.074,
    },
  },
  {
    id: "3",
    product_name: "Whole Wheat Bread",
    code: "9876543210987",
    brands: "Sara Lee",
    nutriments: {
      "energy-kcal_100g": 247,
      "carbohydrates_100g": 43,
      "proteins_100g": 8.7,
      "fat_100g": 3.3,
      "sugars_100g": 4.2,
      "fiber_100g": 6.8,
      "sodium_100g": 0.486,
    },
  },
  {
    id: "4",
    product_name: "Greek Yogurt",
    code: "5555555555555",
    brands: "Fage",
    nutriments: {
      "energy-kcal_100g": 59,
      "carbohydrates_100g": 3.3,
      "proteins_100g": 10.2,
      "fat_100g": 0.4,
      "sugars_100g": 3.3,
      "fiber_100g": 0,
      "sodium_100g": 0.056,
    },
  },
  {
    id: "5",
    product_name: "Salmon Fillet",
    code: "4444444444444",
    brands: "Wild Caught",
    nutriments: {
      "energy-kcal_100g": 208,
      "carbohydrates_100g": 0,
      "proteins_100g": 20,
      "fat_100g": 13,
      "sugars_100g": 0,
      "fiber_100g": 0,
      "sodium_100g": 0.075,
    },
  },
];

export default function FoodList() {
  const [product, setProduct] = useState<searchItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [rememberText, setRememberText] = useState("");
  const [recents, setRecents] = useState<searchItem[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [Searching, setSearching] = useState(false);

  const fetchSearchAPI = async (product: string, page: number) => {
    if (!product.trim()) {
      setProduct([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await invoke<searchReturn>("get_products", {
        product: product,
        page: page,
      });
      setProduct(result.products ?? []);
      console.log(result);

    } catch (err) {
      console.error("Error:", err);

      setError("WE GAAN ALLEMAAL DOOD!! ER WERKT IETS NIET AAN DE DATABASE!!!");
      setProduct([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearching(true);
    setRememberText(searchText);
    setProduct([]);
    void fetchSearchAPI(searchText, 1);

    if (searchText.length === 0) {
      setSearching(false)
    }

  };

  const getStatusMessage = () => {
    if (loading) return { text: "Searching..." };
    if (!loading && error) return { text: error, css: "text-red-400 animate-shake font-bold" };
    if (!loading && !error && product.length === 0 && !Searching)
      return { text: "Search a product" };
    if (!loading && !error && product.length === 0 && Searching)
      return { text: `No products found for "${rememberText}".` };
    return null;
  };

  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-3 bg-background overflow-hidden">
        <div className="mr-4 ml-4 flex">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            onSearch={handleSearch}
            placeholderText="food"
          />
        </div>
      </div>

      {!loading && !Searching && !error && recents.length > 0 ? (
        <div className="pt-15">
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
        <div className="pt-15">
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
            : null))}
        </div>
      )}
    </>
  );
}
