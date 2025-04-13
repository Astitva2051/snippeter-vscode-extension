# Snippet-er: Manage and Suggest Code Snippets

Snippet-er is a Visual Studio Code extension designed to help developers manage, create, and suggest code snippets seamlessly across their projects. With features like authentication, snippet creation, intelligent suggestions,and GenAI to create optimized snippets, Snippet-er enhances productivity and code reuse.

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
- **Status Bar Integration**: Use the Snippet-er status bar icon to quickly access actions like creating snippets, refreshing snippets, logging in, or logging out.
- **Frontend Integration**: Browse and manage snippets through the Snippet-er web interface.

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

- Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and search for `Snippet-er: Login`.
- Alternatively, click the Snippet-er icon in the status bar and select "Login."
- Enter your email and password to log in.

### 2. **Logout**

- Open the command palette and search for `Snippet-er: Logout`.
- Alternatively, click the Snippet-er icon in the status bar and select "Logout."
- This will clear your authentication token and log you out.

### 3. **Create a Snippet**

- Highlight the code you want to save in the editor.
- Right-click and select `Snippet-er: Create New Snippet` from the context menu or use the command palette.
- Alternatively, click the Snippet-er icon in the status bar and select "Create Snippet."
- Provide the following details:
  - **Title**: A name for your snippet.
  - **Tags**: (Optional) Comma-separated tags for categorization.
- The snippet will be saved to your account and cached locally.

### 4. **Refresh Snippets**

- **Periodic Refresh**: Snippets are automatically refreshed at regular intervals. This feature ensures you always have the latest snippets without manual intervention.
- **Manual Refresh**:
  - Open the command palette, search for `Snippet-er: Refresh Snippets`, and select it.
  - Alternatively, click the refresh button in the Snippet-er status bar icon to refresh snippets instantly.

### 5. **Snippet Suggestions**

- While coding, start typing in the editor.
- Snippet-er will suggest relevant snippets based on the language and context.
- Select a suggestion to insert the snippet into your code.

### 6. **Status Bar Icon**

The Snippet-er status bar icon provides quick access to common actions:

- **Logged In**: When logged in, clicking the icon allows you to:
  - Create a new snippet.
  - Refresh snippets.
  - Log out.
- **Logged Out**: When logged out, clicking the icon allows you to:
  - Log in.
  - Register for a new account.

### 7. **Frontend Integration**

- You can also browse and manage snippets through the Snippet-er web interface:
  - **Login Page**: [Snippet-er Login](https://snippet-er.netlify.app/login)
  - **Registration Page**: [Snippet-er Register](https://snippet-er.netlify.app/register)
- From the web interface, you can:
  - View snippets created by other users.
  - Fork snippets from other users to use them as your own in the VS Code extension.
  - Manage your existing snippets.
  - Make use of GenAI to Optimize snippets.

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

## Commands Reference

The following commands are available in Snippet-er:

| Command                          | Description                           |
| -------------------------------- | ------------------------------------- |
| `Snippet-er: Login`              | Log in to your Snippet-er account.    |
| `Snippet-er: Logout`             | Log out of your Snippet-er account.   |
| `Snippet-er: Create New Snippet` | Save selected code as a snippet.      |
| `Snippet-er: Suggest Snippets`   | Get snippet suggestions while coding. |
| `Snippet-er: Refresh Snippets`   | Refresh the snippet cache manually.   |

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
