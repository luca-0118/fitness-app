# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Building project to APK

### Prerequisites

To build this project into an APK, you need to create a keystore file for signing.

**⚠️ IMPORTANT: These files are excluded from Git for security reasons.**

### Setup Instructions

1. **Generate a keystore** (if you don't have one):

    ```bash
    keytool -genkey -v -keystore keystore.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias upload
    ```

2. **Move the keystore** to the project:

    ```bash
    mv keystore.jks src-tauri/gen/android/keystore.jks
    ```

3. **Create** `src-tauri/gen/android/keystore.properties` with:

    ```properties
    password=YOUR_PASSWORD
    keyAlias=upload
    storeFile=keystore.jks
    ```

4. **Build the APK**:
    ```bash
    npm run tauri android build --apk
    ```

> **Note:** The `keystore.jks` and `keystore.properties` files are gitignored. Each team member needs to create or obtain these files separately.
