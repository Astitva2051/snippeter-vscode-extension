import axios, { AxiosError } from "axios";
import * as vscode from "vscode";
import { getStoredToken } from "./utils/storage";
import { API_BASE_URL } from "./utils/config";

/**
 * Interface representing a code snippet with detailed metadata
 */
interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

/**
 * Interface for creating a new snippet with optional complexity metrics
 */
interface SnippetCreationPayload {
  title: string;
  code: string;
  language: string;
  tags?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

/**
 * Fetches user snippets for a specific programming language
 *
 * @param language - Programming language to fetch snippets for
 * @returns Array of snippets matching the language
 */
export async function fetchSnippets(language: string): Promise<Snippet[]> {
  try {
    // Retrieve stored authentication token
    const token = await getStoredToken();

    // Validate user authentication
    if (!token) {
      vscode.window.showErrorMessage(
        "Authentication required. Please log in to snippet-er."
      );
      return [];
    }

    // Configure authenticated request with cache prevention
    const response = await axios.get<{ snippets: Snippet[] }>(
      `${API_BASE_URL}/snippets/userSnippets`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        timeout: 5000,
      }
    );

    // Filter snippets by language and log details
    const languageSnippets = response.data.snippets.filter(
      (snippet) => snippet.language === language
    );

    console.log(`Fetched ${languageSnippets.length} snippets for ${language}`);

    return languageSnippets;
  } catch (error) {
    // Comprehensive error handling for network and authentication issues
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            vscode.window.showErrorMessage(
              "Authentication expired. Please log in again."
            );
            break;
          case 403:
            vscode.window.showErrorMessage(
              "Access forbidden. Check your permissions."
            );
            break;
          case 404:
            vscode.window.showErrorMessage("Snippets endpoint not found.");
            break;
          case 500:
            vscode.window.showErrorMessage(
              "Server error. Please try again later."
            );
            break;
          default:
            vscode.window.showErrorMessage(
              `Network error: ${axiosError.message}`
            );
        }
      } else if (axiosError.request) {
        vscode.window.showErrorMessage(
          "No response from server. Check your internet connection."
        );
      } else {
        vscode.window.showErrorMessage(
          `Request setup error: ${axiosError.message}`
        );
      }
    } else {
      vscode.window.showErrorMessage(
        `Unexpected error fetching snippets: ${error}`
      );
    }

    return [];
  }
}

/**
 * Creates a new snippet on the server
 *
 * @param snippetData Detailed snippet information to save
 * @returns Boolean indicating successful snippet creation
 */
export async function createSnippet(
  snippetData: SnippetCreationPayload
): Promise<boolean> {
  try {
    // Retrieve authentication token
    const token = await getStoredToken();

    // Validate authentication
    if (!token) {
      vscode.window.showErrorMessage(
        "Authentication required. Please log in to snippet-er."
      );
      return false;
    }

    // Validate snippet data completeness
    if (!snippetData.title || !snippetData.code || !snippetData.language) {
      vscode.window.showErrorMessage("Incomplete snippet details.");
      return false;
    }

    // Send snippet creation request
    const response = await axios.post(
      `${API_BASE_URL}/snippets/add-snippet`,
      snippetData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    // Log successful creation
    console.log(`Snippet '${snippetData.title}' created successfully`);

    return true;
  } catch (error) {
    // Comprehensive error handling for creation process
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            vscode.window.showErrorMessage(
              "Authentication expired. Please log in again."
            );
            break;
          case 403:
            vscode.window.showErrorMessage(
              "Access forbidden. Check your permissions."
            );
            break;
          case 500:
            vscode.window.showErrorMessage(
              "Server error. Could not save snippet. Please try again later."
            );
            break;
          default:
            vscode.window.showErrorMessage(
              `Network error: ${axiosError.message}`
            );
        }
      } else if (axiosError.request) {
        vscode.window.showErrorMessage(
          "No response from server. Check your internet connection."
        );
      } else {
        vscode.window.showErrorMessage(
          `Request setup error: ${axiosError.message}`
        );
      }
    } else {
      vscode.window.showErrorMessage(
        `Unexpected error creating snippet: ${error}`
      );
    }

    return false;
  }
}
