import * as vscode from "vscode";

// Unique key for storing authentication token
const SECRET_KEY = "snippet-er.token";

/**
 * Securely stores the authentication token
 *
 * @param token Authentication token to store
 */
export async function storeToken(token: string) {
  await vscode.workspace
    .getConfiguration()
    .update(SECRET_KEY, token, vscode.ConfigurationTarget.Global);
}

/**
 * Retrieves the stored authentication token
 *
 * @returns Stored token or null if not found
 */
export async function getStoredToken(): Promise<string | null> {
  return vscode.workspace.getConfiguration().get(SECRET_KEY) || null;
}

/**
 * Clears the stored authentication token
 * Used during logout process
 */
export async function clearToken() {
  await vscode.workspace
    .getConfiguration()
    .update(SECRET_KEY, null, vscode.ConfigurationTarget.Global);
}
