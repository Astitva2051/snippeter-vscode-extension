import * as vscode from "vscode";
import { loginUser, logoutUser } from "./utils/auth";
import { fetchSnippets, createSnippet } from "./snippets";
import { throttle } from "./utils/performance";
import { getStoredToken } from "./utils/storage";
import { FRONTEND_REGISTER_URL } from "./utils/config";

// Define supported languages as an enum
enum SupportedLanguage {
  JavaScript = "javascript",
  TypeScript = "typescript",
  Python = "python",
  Java = "java",
  C = "c",
  CPP = "cpp",
  CSharp = "csharp",
  Go = "go",
  Rust = "rust",
  Ruby = "ruby",
  PHP = "php",
  Swift = "swift",
  Kotlin = "kotlin",
  SQL = "sql",
  HTML = "html",
  CSS = "css",
}

// Convert enum to array for iteration
const supportedLanguages = Object.values(SupportedLanguage);

// Cache to store snippets and reduce network requests
const snippetCache: Record<string, any[]> = {};

// Declare a common progress indicator at the module level
let commonProgressIndicator: vscode.StatusBarItem;

/**
 * Updates the common progress indicator with a specific message
 *
 * @param message The message to display in the status bar
 */
function showProgressIndicator(message: string) {
  if (!commonProgressIndicator) {
    commonProgressIndicator = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
  }
  commonProgressIndicator.text = message;
  commonProgressIndicator.show();
}

/**
 * Hides the common progress indicator
 */
function hideProgressIndicator() {
  if (commonProgressIndicator) {
    commonProgressIndicator.hide();
  }
}

/**
 * Refreshes the snippet cache for a specific language
 *
 * @param language Language to refresh cache for
 */
async function refreshSnippetCache(language: string): Promise<void> {
  try {
    // Fetch fresh snippets from the server
    const freshSnippets = await fetchSnippets(language);

    // Update the cache with fresh data
    snippetCache[language] = freshSnippets;

    // console.log(
    //   `Refreshed snippet cache for ${language}: ${freshSnippets.length} snippets`
    // );
  } catch (error) {
    console.error(`Failed to refresh snippet cache: ${error}`);
  }
}

/**
 * Calculates a match score between source and target strings
 *
 * @param source Source string to match against
 * @param target Target string to match
 * @returns Match quality score between 0 and 1
 */
function calculateMatchScore(source: string, target: string): number {
  source = source.toLowerCase();
  target = target.toLowerCase();

  if (source === target) {
    return 1.0;
  }
  if (source.includes(target)) {
    return 0.7;
  }
  if (source.startsWith(target)) {
    return 0.5;
  }

  return 0;
}

/**
 * Shows a quick pick for language selection
 *
 * @returns Selected language or undefined
 */
async function showLanguageQuickPick(): Promise<string | undefined> {
  const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "cpp",
    "csharp",
    "go",
    "rust",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "sql",
    "html",
    "css",
  ];

  return await vscode.window.showQuickPick(languages, {
    placeHolder: "Select the programming language",
    title: "Language Selection",
  });
}

/**
 * Handles saving a snippet with authentication check
 * Prompts user to log in if not authenticated
 */
async function saveSnippet() {
  try {
    // Check authentication first
    const token = await getStoredToken();
    if (!token) {
      const loginResponse = await vscode.window.showErrorMessage(
        "Authentication required to save snippets. Would you like to log in to snippet-er?",
        "Login",
        "Cancel"
      );

      if (loginResponse === "Login") {
        try {
          await loginUser();
          updateStatusBarCommand(); // Update the status bar after login
        } catch (error) {
          vscode.window.showErrorMessage(
            "Login failed. Please check your credentials and try again."
          );
        }
        return; // Return early, user can try again after login
      } else {
        return; // User cancelled
      }
    }

    // Get the active editor
    const textEditor = vscode.window.activeTextEditor;
    if (!textEditor) {
      vscode.window.showErrorMessage("No active editor found");
      return;
    }

    // Use selected text
    const selection = textEditor.selection;
    if (selection.isEmpty) {
      vscode.window.showErrorMessage(
        "No code selected! Please highlight the code you want to save."
      );
      return;
    }

    const snippetCode = textEditor.document.getText(selection);
    let language = textEditor.document.languageId;

    // Validate language
    if (language === "plaintext") {
      language = (await showLanguageQuickPick()) || "";
      if (!language) {
        return;
      } // User cancelled
    }

    // Get title
    const title = await vscode.window.showInputBox({
      prompt: "Enter a title for your snippet",
      placeHolder: "Snippet Title",
      validateInput: (value) => (!value ? "Title cannot be empty" : null),
    });

    if (!title) {
      return;
    } // User cancelled

    // Optional tags input
    const tagsInput = await vscode.window.showInputBox({
      prompt: "Enter tags (comma-separated, optional)",
      placeHolder: "api, fetch, javascript",
    });

    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    // Create snippet
    const result = await createSnippet({
      title,
      code: snippetCode,
      language,
      tags,
    });

    if (result) {
      // console.log("Snippet saved successfully:", result);
      // Refresh the snippet cache for this language to include the new snippet

      showProgressIndicator(`$(sync~spin) Refreshing Snippets`);
      await refreshSnippetCache(language);
      hideProgressIndicator();

      // console.log("Snippet cache refreshed for language:", language);

      vscode.window.showInformationMessage(
        `Snippet '${title}' saved successfully!`
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to save snippet: ${error}`);
  }
}

/**
 * Function to update the status bar item's command based on login status
 */
async function updateStatusBarCommand() {
  const token = await getStoredToken();
  if (token) {
    snippetStatusBarItem.command = "extension.handleLoggedInClick"; // Custom command for logged-in actions
    snippetStatusBarItem.tooltip =
      "Choose an action: Create, Refresh or Logout";
  } else {
    snippetStatusBarItem.command = "extension.handleLoggedOutClick"; // Command for logged-out actions
    snippetStatusBarItem.tooltip = "Log in or register to manage your snippets";
  }
  snippetStatusBarItem.show();
}

// Declare snippetStatusBarItem at the module level
let snippetStatusBarItem: vscode.StatusBarItem;

/**
 * Activates the VS Code extension
 *
 * @param context Extension context for registering commands
 */
export function activate(context: vscode.ExtensionContext) {
  // Periodically refresh snippet cache every 30 minutes
  setInterval(async () => {
    showProgressIndicator("$(sync~spin) Refreshing Snippets");
    for (const language of supportedLanguages) {
      await refreshSnippetCache(language);
    }
    // console.log("Snippet cache refreshed for all languages");
    hideProgressIndicator();
  }, 30 * 60 * 1000); // Refresh every 30 minutes

  // Register authentication commands
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.login", async () => {
      try {
        await loginUser();
        updateStatusBarCommand(); // Update the status bar after login

        showProgressIndicator(`$(sync~spin) Refreshing Snippets`);
        // Refresh snippet cache for all supported languages after login
        for (const language of supportedLanguages) {
          await refreshSnippetCache(language);
        }

        hideProgressIndicator();
      } catch (error) {
        vscode.window.showErrorMessage("Login failed. Please try again.");
      } finally {
        hideProgressIndicator();
      }
    }),
    vscode.commands.registerCommand("extension.logout", async () => {
      showProgressIndicator("$(sync~spin) Logging out...");
      try {
        await logoutUser();
        updateStatusBarCommand(); // Update the status bar after logout

        // Clear the snippet cache on logout
        Object.keys(snippetCache).forEach((key) => delete snippetCache[key]);
      } finally {
        hideProgressIndicator();
      }
    }),
    vscode.commands.registerCommand("extension.saveSnippet", async () => {
      await saveSnippet(); // Register the saveSnippet command
    })
  );

  // Register the command to refresh snippet cache
  // This command can be triggered from the status bar or command palette
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.refreshCache", async () => {
      showProgressIndicator("$(sync~spin) Refreshing Snippets...");
      for (const language of supportedLanguages) {
        await refreshSnippetCache(language);
      }
      vscode.window.showInformationMessage("Snippet cache refreshed!");
      hideProgressIndicator();
    })
  );

  // Create a status bar item for Snippet-er
  snippetStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right, // Align to the right
    100
  );
  snippetStatusBarItem.text = "$(book) Snippet-er";
  snippetStatusBarItem.tooltip = "Manage your code snippets";

  // Add the status bar item to the subscriptions
  context.subscriptions.push(snippetStatusBarItem);

  // Function to handle status bar click when logged in
  async function handleLoggedInClick() {
    const action = await vscode.window.showQuickPick(
      ["Create Snippet", "Refresh Snippets", "Logout"],
      {
        placeHolder: "Choose an action",
      }
    );

    if (action === "Create Snippet") {
      vscode.commands.executeCommand("extension.saveSnippet");
    } else if (action === "Refresh Snippets") {
      vscode.commands.executeCommand("extension.refreshCache");
    } else if (action === "Logout") {
      vscode.commands.executeCommand("extension.logout");
    }
  }

  // Function to handle status bar click when logged out
  async function handleLoggedOutClick() {
    const action = await vscode.window.showQuickPick(["Login", "Register"], {
      placeHolder: "Choose an action",
    });

    if (action === "Login") {
      vscode.commands.executeCommand("extension.login");
    } else if (action === "Register") {
      vscode.window
        .showInformationMessage(
          "You will be redirected to the registration page in your browser.",
          "Proceed"
        )
        .then(async (selection) => {
          if (selection === "Proceed") {
            await vscode.env.openExternal(
              vscode.Uri.parse(FRONTEND_REGISTER_URL)
            );
          }
        });
    }
  }

  // Register the custom command for logged-in actions
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.handleLoggedInClick",
      handleLoggedInClick
    )
  );

  // Register the custom command for logged-out actions
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.handleLoggedOutClick",
      handleLoggedOutClick
    )
  );

  // Call the function initially to set the correct status bar command
  updateStatusBarCommand();

  // Add the status bar item to the subscriptions
  context.subscriptions.push(snippetStatusBarItem);

  showProgressIndicator(`$(sync~spin) Refreshing Snippets`);

  // Refresh snippet cache for all supported languages on activation
  supportedLanguages.forEach(async (language) => {
    await refreshSnippetCache(language);
  });

  hideProgressIndicator();

  // Register completion providers for each supported language
  supportedLanguages.forEach((language) => {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        language,
        {
          // Throttled version of completion to prevent excessive API calls
          provideCompletionItems: throttle(async (document, position) => {
            const textLine = document
              .lineAt(position.line)
              .text.substring(0, position.character);

            const match = textLine.match(/(\w+)$/);
            const typedText = match ? match[1].toLowerCase() : "";

            if (!typedText) {
              return [];
            }

            // Use cached snippets if available, otherwise fetch new ones
            let snippets = snippetCache[language];
            if (!snippets) {
              snippets = await fetchSnippets(language);
              snippetCache[language] = snippets;
            }

            // Advanced snippet matching with scoring
            const matchingSnippets = snippets.filter((snippet: any) => {
              const titleScore = calculateMatchScore(snippet.title, typedText);
              const tagScore = snippet.tags
                ? Math.max(
                    ...snippet.tags.map((tag: string) =>
                      calculateMatchScore(tag, typedText)
                    )
                  )
                : 0;

              return titleScore > 0.5 || tagScore > 0.5;
            });

            return matchingSnippets.map((snippet: any) => {
              const completionItem = new vscode.CompletionItem(
                snippet.title,
                vscode.CompletionItemKind.Snippet
              );

              completionItem.insertText = new vscode.SnippetString(
                snippet.code
              );

              // Detailed documentation with markdown support
              completionItem.documentation = new vscode.MarkdownString(
                `**Time Complexity:** ${snippet.timeComplexity || "N/A"}\n\n` +
                  `**Space Complexity:** ${
                    snippet.spaceComplexity || "N/A"
                  }\n\n` +
                  `**Tags:** ${snippet.tags?.join(", ") || "None"}\n\n` +
                  `**Code:**\n\`\`\`${language}\n${snippet.code}\n\`\`\``
              );

              return completionItem;
            });
          }, 300),
        },
        ...Array.from(
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"
        )
      )
    );
  });

  // Show activation message
  vscode.window.showInformationMessage("Snippet-er Extension Activated!");
}

/**
 * Deactivation hook for cleanup
 */
export function deactivate() {
  // Clear snippet cache
  Object.keys(snippetCache).forEach((key) => delete snippetCache[key]);
  hideProgressIndicator(); // Ensure progress indicator is hidden on deactivation
}
