import { Dispatch, SetStateAction, useState } from "react";
import { Outlet } from "react-router-dom";
import SearchBar from "../../components/General/misc/SearchBar.tsx";
import BarcodeScanner from "../../components/Foodtracker/misc/barcodeScanner.tsx";
import { invoke } from "@tauri-apps/api/core";

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
interface searchReturn {
  page: string;
  page_count: number;
  page_size: number;
  products: searchItem[];
  product: searchItem[];
  skip: number;
}

export interface FoodPageContext {
  product: searchItem[];
  productBarcode: any;
  searchText: string;
  recents: searchItem[];
  setRecents: Dispatch<SetStateAction<searchItem[]>>;
  loading: boolean;
  error: any;
  Searching: boolean;
  barcode: number;
  getStatusMessage: () => { text: string; css?: string } | null;
}

export default function FoodPage() {
  const [product, setProduct] = useState<searchItem[]>([]);
  const [productBarcode, setProductBarcode] = useState<any>();
  const [searchText, setSearchText] = useState("");
  const [rememberText, setRememberText] = useState("");
  const [recents, setRecents] = useState<searchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>("");
  const [Searching, setSearching] = useState(false);
  const [barcode, setBarcode] = useState(0);

  const fetchWithRetry = async (
    product: string,
    page: number,
    retries = 10
  ): Promise<searchReturn> => {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await invoke<searchReturn>("get_products", {
          product,
          page,
        });
      } catch (err) {
        lastError = err;

        console.log(`Attempt ${attempt}/${retries} failed`);

        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    throw lastError;
  };
    
    const fetchSearchAPI = async (product: string, page: number) => {
    if (!product.trim()) {
      setProduct([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWithRetry(product, page, 10);
      setProduct(result.products ?? []);
    } catch (err) {
      console.error(err);
      setError("db error");
      setProduct([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setRememberText(searchText);
    setProduct([]);
    setProductBarcode(null);
    setSearching(true);
    void fetchSearchAPI(searchText, 1);

    if (searchText.length === 0) {
      setSearching(false);
    }
  };

  const getStatusMessage = () => {
    if (loading) return { text: "Searching..." };
    if (!loading && error) return { text: error, css: "font-bold" };
    if (!loading && !error && product.length === 0 && !Searching && !productBarcode)
      return { text: "Search a product" };
    if (!loading && !error && product.length === 0 && Searching && !productBarcode)
      return { text: `No products found for "${rememberText}".` };
    return null;
  };

  function handleProductFromChild(data: any) {
    setProductBarcode(data);
    setProduct([]);
  }
  function handleErrorFromChild(data: any) {
    setError(data);
  }
  function handleLoadingFromChild(data: any) {
    setLoading(data);
  }
  function handleSetBarcode(data: any) {
    setBarcode(data);
  }

  return (
    <div className="">
      <div className="mr-4 ml-4 flex pt-2 pb-1">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          onSearch={handleSearch}
          placeholderText="food"
        />
        <div className="h-11 w-13">
          <BarcodeScanner
            onProductScan={handleProductFromChild}
            onError={handleErrorFromChild}
            onLoading={handleLoadingFromChild}
            searching={Searching}
            setSearching={setSearching}
            setBarcode={handleSetBarcode}
          />
        </div>
      </div>
      <div className="">
        {/* <nav className="flex justify-center gap-10 text-textcolor border-2">
          <NavLink to="/food-page">All products</NavLink>
          <NavLink to="custom-food">Created by me</NavLink>
        </nav> */}
      </div>
      <div className="mt-4">
        <Outlet
          context={{
            product,
            productBarcode,
            searchText,
            recents,
            setRecents,
            loading,
            error,
            Searching,
            barcode,
            getStatusMessage,
          }}
        />
      </div>
    </div>
  );
}