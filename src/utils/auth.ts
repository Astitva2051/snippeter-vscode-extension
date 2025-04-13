import * as vscode from "vscode";
import axios from "axios";
import { API_BASE_URL, FRONTEND_REGISTER_URL } from "./config";
import { storeToken, clearToken } from "./storage";

/**
 * Validates an email address using a regex pattern
 *
 * @param email Email address to validate
 * @returns Boolean indicating email validity
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Handles the user login process
 * Provides a secure, user-friendly login experience
 */
export async function loginUser() {
  try {
    // Prompt for email with validation
    const email = await vscode.window.showInputBox({
      prompt: "Enter your email",
      validateInput: (value) =>
        !validateEmail(value) ? "Please enter a valid email address" : null,
    });

    if (!email) {
      return;
    } // User cancelled

    // Prompt for password with masking
    const password = await vscode.window.showInputBox({
      prompt: "Enter your password",
      password: true, // Mask input
      validateInput: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    });

    if (!password) {
      return;
    } // User cancelled

    // Show progress indicator during login
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Logging in...",
        cancellable: false,
      },
      async () => {
        // Attempt login
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });

        // Securely store authentication token
        await storeToken(response.data.token);

        // Show success message
        vscode.window.showInformationMessage("Login successful!");
      }
    );
  } catch (error) {
    // Comprehensive error handling
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Specific unauthorized error with registration option
        vscode.window
          .showErrorMessage(
            "Invalid credentials. Would you like to register?",
            "Register"
          )
          .then((selection) => {
            if (selection === "Register") {
              vscode.env.openExternal(vscode.Uri.parse(FRONTEND_REGISTER_URL));
            }
          });
      } else {
        vscode.window.showErrorMessage(
          `Login failed: ${error.response?.data?.message || error.message}`
        );
      }
    } else {
      vscode.window.showErrorMessage(
        "An unexpected error occurred during login"
      );
    }
  }
}

/**
 * Handles the user logout process
 * Clears authentication token and provides user feedback
 */
export async function logoutUser() {
  try {
    // Clear authentication token
    await clearToken();

    // Provide logout confirmation
    vscode.window.showInformationMessage("Logged out successfully!");
  } catch (error) {
    vscode.window.showErrorMessage(`Logout failed: ${error}`);
  }
}
