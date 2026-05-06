use reqwest::Client;

#[tauri::command]
pub async fn get_product_by_barcode(product: String) -> Result<serde_json::Value, String> {
    let client = Client::builder()
        .user_agent("Fitness app/1.0 (lars200221@gmail.com)")
        .build()
        .unwrap();

    let body = client
    .get(format!(
        "https://world.openfoodfacts.net/api/v2/product/{}?product_type=all&cc=nl&lc=nl&fields=product_name%2Cnutriments%2Cbrands_tags",
        product
    )).send()
    .await
    .map_err(|e| e.to_string())?
    .json::<serde_json::Value>()
    .await
    .map_err(|e| e.to_string())?;

    Ok(body)
}
