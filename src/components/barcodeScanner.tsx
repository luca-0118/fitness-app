import { invoke } from "@tauri-apps/api/core";
import { BarcodeIcon } from "./SVG";

import {
  Format,
  scan,
} from "@tauri-apps/plugin-barcode-scanner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface states{
  onProductScan: any
  onLoading: any
  onError: any

  searching: boolean
  setSearching: any
}


export default function BarcodeScanner({onProductScan, onLoading, onError,  searching, setSearching}: states ){

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
      // TODO check for permissions front-end
      onError(null);
      setSearching(true);

      try {
          const scanned = await scan({
            formats: [Format.EAN13, Format.EAN8,Format.QRCode],
          });

          await fetchBarcodeAPI(scanned.content);
      }

      catch (err) {
          console.error("Barcode scan failed:", err);
          onError(err)
      }

      finally {
        setSearching(false);
      }
  };

return(
    <>
        {searching && (
            <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center">
                <div>
                    <button onClick={() => setSearching(false)} className="absolute left-0 cursor-pointer text-textcolor">
                        <ArrowBackIcon sx={{ fontSize: 32 }} />
                    </button>

                    {/* Title */}
                    <h1 className="text-white text-2xl font-semibold mb-8">
                        Scan a barcode
                    </h1>
                </div>
                {/* Scanner Frame */}
                <div className="relative w-72 h-72">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-accent rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-accent rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-accent rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-accent rounded-br-xl" />
                </div>

                <p className="text-white/70 mt-6">
                    Point your camera at a barcode
                </p>
            </div>
        )}
        <button
            className="w-11 h-11 p-2 mt-3 mx-2 border-bordercolor border rounded-md text-accent active:text-accent-action bg-components "
            onClick={()=>handleBarcodeSearch()}>
                <BarcodeIcon className="text-current" />
        </button>
    </>
)}