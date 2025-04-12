# Snippet-er: Manage and Suggest Code Snippets

Snippet-er is a Visual Studio Code extension designed to help developers manage, create, and suggest code snippets seamlessly across their projects. With features like authentication, snippet creation, and intelligent suggestions, Snippet-er enhances productivity and code reuse.

---

## Features

- **Authentication**: Secure login and logout functionality to manage your snippets.
- **Snippet Creation**: Save selected code snippets directly from the editor.
- **Snippet Suggestions**: Get intelligent snippet suggestions while coding, based on context and language.
- **Language Support**: Works with multiple programming languages, including JavaScript, TypeScript, Python, Java, and more.
- **Snippet Metadata**: Add tags, time complexity, and space complexity to snippets for better organization.
- **Snippet Cache**: Caches snippets locally to reduce network requests and improve performance.
- **Periodic Refresh**: Automatically refresh snippets at regular intervals to ensure you have the latest updates.
- **Manual Refresh**: Refresh snippets manually using a command or the refresh button in the status bar.

---

## Requirements

- Visual Studio Code version `^1.97.0` or higher.
- Node.js version `18.x` or higher.
- An account on the Snippet-er platform for authentication.

---

## Installation

1. Open Visual Studio Code.

2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or pressing `Ctrl+Shift+X`.

3. Search for `Snippet-er` in the Extensions Marketplace.

4. Click `Install` to add the extension to your editor.

---

## Usage

### 1. **Login**

- Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) or click the Snippet-er icon in the status bar.
- Search for `Snippet-er: Login` and select it.
- Enter your email and password to log in.
- If the credentials are invalid, you will be prompted to register.

### 2. **Register**

- If you don't have an account, you can register by selecting the "Register" option when prompted.
- Alternatively, click the Snippet-er icon in the status bar and select "Register."
- This will redirect you to the registration page in your browser.

### 3. **Create a Snippet**

- Highlight the code you want to save in the editor.
- Right-click and select `Snippet-er: Create New Snippet` from the context menu, use the command palette, or click the Snippet-er icon in the status bar to run the same command.
- Provide the following details:
  - **Title**: A name for your snippet.
  - **Tags**: (Optional) Comma-separated tags for categorization.
- The snippet will be saved to your account and cached locally.

### 4. **Refresh Snippets**

- **Periodic Refresh**: Snippets are automatically refreshed at regular intervals. This feature ensures you always have the latest snippets without manual intervention.
- **Manual Refresh**:
  - Open the command palette, search for `Snippet-er: Refresh Snippets`, and select it.
  - Alternatively, click the refresh button in the Snippet-er status bar icon to refresh snippets instantly.

### 5. **Logout**

- Open the command palette, search for `Snippet-er: Logout`, or click the Snippet-er icon in the status bar and select "Logout."
- This will clear your authentication token and log you out.

### 6. **Snippet Suggestions**

- While coding, start typing in the editor.
- Snippet-er will suggest relevant snippets based on the language and context.
- Select a suggestion to insert the snippet into your code.

---

## Supported Languages

Snippet-er supports the following programming languages:

- JavaScript
- TypeScript
- Python
- Java
- C
- C++
- C#
- Go
- Rust
- Ruby
- PHP
- Swift
- Kotlin
- SQL
- HTML
- CSS

---

## Extension Settings

Snippet-er provides the following configuration options:

- **`snippet-er.token`**: Authentication token for managing snippets.
- **`snippet-er.autoSuggest`**: Enable or disable automatic snippet suggestions.
- **`snippet-er.snippetLanguages`**: List of programming languages for which snippets are suggested.
- **`snippet-er.refreshInterval`**: Set the interval (in minutes) for periodic snippet refresh. Default is 15 minutes.

---

## Known Issues

- Ensure your internet connection is stable for authentication and snippet fetching.

---

## Release Notes

### 0.2.0

- Added periodic refresh for snippets.
- Added manual refresh command.
- Added refresh button in the status bar icon.

### 0.1.0

- Initial release with login, logout, snippet creation, and suggestion features.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For support or feedback, please reach out to the repository owner at [GitHub](https://github.com/Astitva2051/snippeter-vscode-extension).
