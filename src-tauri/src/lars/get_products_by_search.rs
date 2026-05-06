use reqwest::Client;

#[tauri::command]
pub async fn get_products(product: String, page: u64) -> Result<serde_json::Value, String> {
    let client = Client::builder()
        .user_agent("Fitness app/1.0 (lars200221@gmail.com)")
        .build()
        .unwrap();

    let body = client
    .get(format!(
        "https://world.openfoodfacts.net/cgi/search.pl?search_terms={}&search_simple=1&action=process&json=1&countries=nl&page={}",
        product, page
    )).send()
    .await
    .map_err(|e| e.to_string())?
    .json::<serde_json::Value>()
    .await
    .map_err(|e| e.to_string())?;

    Ok(body)
}
