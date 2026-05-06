import { invoke } from "@tauri-apps/api/core";
import { BarcodeIcon } from "./SVG";

import {
  Format,
  scan,
} from "@tauri-apps/plugin-barcode-scanner";

interface states{
  onProductScan: any
  onLoading: any
  onError: any
  onSearching: any
}

export default function BarcodeScanner({onProductScan, onLoading, onError, onSearching}: states ){

const fetchBarcodeAPI = async (product: string) => {
    if (!product.trim()) {
      onError(null);
      return;
    }
    onLoading(true);
    onError(null);

    try {
      const result = await invoke<any>("get_product_by_barcode", {
        product: product,
      });
      onProductScan(result.product)
      console.log(result.product)

    } catch (err) {
      console.error("Error:", err);

      onError("db error");
    } finally {
      onLoading(false);
    }
  };

  const handleBarcodeSearch = async () => {
  onError(null);
  try {
    const scanned = await scan({
      formats: [Format.EAN13, Format.EAN8,Format.QRCode],
    });
    onSearching(true);
    void fetchBarcodeAPI(scanned.content);
  } catch (err) {
    console.error("Barcode scan failed:", err);
    onError(err)
  }
};

return <button className="w-11 h-11 p-2 mt-3 mx-2 border-bordercolor border rounded-md text-accent active:text-accent-action bg-components " onClick={()=>handleBarcodeSearch()}><BarcodeIcon className="text-current" /></button>
}