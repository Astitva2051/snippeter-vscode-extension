import * as vscode from "vscode";

/**
 * Performance Utility Module with Improved Type Safety
 */

// Enhanced generic function type definition
type GenericFunction<T extends any[] = any[], R = any> = (...args: T) => R;

/**
 * Throttle utility with improved type safety and error handling
 */
export function throttle<T extends GenericFunction>(
  func: T,
  delay: number = 300,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = { leading: true, trailing: true }
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecution = 0;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  const throttledFunction = function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const now = Date.now();

    // Leading edge execution
    if (options.leading && !lastExecution) {
      lastExecution = now;
      return func.apply(this, args);
    }

    // Cancel existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Store context and arguments
    lastArgs = args;
    lastThis = this;

    // Execute if enough time has passed
    if (now - lastExecution >= delay) {
      lastExecution = now;
      return func.apply(this, args);
    }

    // Trailing edge execution
    if (options.trailing) {
      timeoutId = setTimeout(() => {
        if (lastArgs && options.trailing) {
          lastExecution = Date.now();
          return func.apply(lastThis, lastArgs);
        }
      }, delay);
    }

    // Return undefined to maintain type safety
    return undefined;
  } as T;

  return throttledFunction;
}

/**
 * Debounce utility with improved type safety
 */
export function debounce<T extends GenericFunction>(
  func: T,
  delay: number = 300,
  immediate: boolean = false
): T {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedFunction = function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const context = this;

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Flag to track execution
    let called = false;

    // Immediate execution for the first call
    if (immediate && !timeoutId) {
      func.apply(context, args);
      called = true;
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate || !called) {
        return func.apply(context, args);
      }
    }, delay);

    // Return undefined to maintain type safety
    return undefined;
  } as T;

  return debouncedFunction;
}

/**
 * Memoization utility with improved caching
 */
export function memoize<T extends GenericFunction>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    // Create a cache key
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    // Return cached result if exists
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    // Compute and cache the result
    const result = func.apply(this, args);
    cache.set(key, result);

    return result;
  } as T;
}

/**
 * Performance measurement utility
 */
export function measurePerformance<T extends GenericFunction>(
  func: T,
  label?: string
): T {
  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();

    try {
      const result = func.apply(this, args);

      // Handle both sync and async functions
      if (result instanceof Promise) {
        return result.then((asyncResult) => {
          const end = performance.now();
          console.log(`[Performance] ${label || func.name}: ${end - start}ms`);
          return asyncResult;
        }) as ReturnType<T>;
      }

      const end = performance.now();
      console.log(`[Performance] ${label || func.name}: ${end - start}ms`);

      return result;
    } catch (error) {
      const end = performance.now();
      console.error(
        `[Performance] ${label || func.name} failed: ${end - start}ms`
      );
      throw error;
    }
  } as T;
}

/**
 * Rate limiter utility
 */
export function rateLimiter<T extends GenericFunction>(
  func: T,
  limit: number = 5,
  interval: number = 1000
): T {
  let calls: number[] = [];

  return function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const now = Date.now();

    // Remove calls outside the current interval
    calls = calls.filter((callTime) => now - callTime < interval);

    // Check if within rate limit
    if (calls.length >= limit) {
      vscode.window.showWarningMessage("Too many requests. Please wait.");
      return undefined;
    }

    // Record the call and execute the function
    calls.push(now);
    return func.apply(this, args);
  } as T;
}

/**
 * Comprehensive example of utility usage
 */
export function demonstrateUtilities() {
  // Throttled function example
  const throttledGreet = throttle((name: string) => {
    console.log(`Hello, ${name}!`);
    return `Greeted ${name}`;
  }, 500);

  // Debounced function example
  const debouncedSearch = debounce((query: string) => {
    console.log(`Searching for: ${query}`);
    return `Results for ${query}`;
  }, 300);

  // Memoized function example with custom resolver
  const memoizedAdd = memoize(
    (a: number, b: number) => {
      console.log("Calculating...");
      return a + b;
    },
    (a, b) => `${a}-${b}` // Custom key generation
  );

  // Performance measured function
  const performanceTrackedSquare = measurePerformance((x: number) => {
    return x * x;
  }, "Square Calculation");

  // Rate-limited function
  const rateLimitedLog = rateLimiter(
    (message: string) => {
      console.log(`Logging: ${message}`);
      return `Logged: ${message}`;
    },
    3, // 3 calls
    5000 // per 5 seconds
  );
}
