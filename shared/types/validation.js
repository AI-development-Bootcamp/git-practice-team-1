import { z } from 'zod';

/**
 * Validation Result Type
 * @typedef {Object} ValidationResult
 * @property {boolean} success - Whether validation succeeded
 * @property {any} [data] - Parsed and validated data (if success)
 * @property {Array<{path: string, message: string}>} [errors] - Validation errors (if failed)
 */

/**
 * Validate data against a Zod schema
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {any} data - The data to validate
 * @returns {ValidationResult} Validation result with success flag and data/errors
 */
export const validateData = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ path: 'unknown', message: error.message }],
    };
  }
};

/**
 * Safe parse that returns undefined on error
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {any} data - The data to validate
 * @returns {any|undefined} Validated data or undefined if validation fails
 */
export const safeParse = (schema, data) => {
  const result = schema.safeParse(data);
  return result.success ? result.data : undefined;
};

/**
 * Validate data and throw detailed error if validation fails
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {any} data - The data to validate
 * @param {string} [context] - Optional context for better error messages
 * @returns {any} Validated data
 * @throws {Error} Detailed validation error
 */
export const validateOrThrow = (schema, data, context = '') => {
  const result = validateData(schema, data);

  if (!result.success) {
    const errorMessages = result.errors
      .map(err => `${err.path}: ${err.message}`)
      .join(', ');

    const contextMsg = context ? `[${context}] ` : '';
    throw new Error(`${contextMsg}Validation failed: ${errorMessages}`);
  }

  return result.data;
};

/**
 * Create a validation hook for React components
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @returns {Function} Validation function for use in components
 */
export const createValidator = (schema) => {
  return (data) => validateData(schema, data);
};

/**
 * Batch validate multiple items
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {Array<any>} items - Array of items to validate
 * @returns {Object} Object with valid items and invalid items with errors
 */
export const batchValidate = (schema, items) => {
  const valid = [];
  const invalid = [];

  items.forEach((item, index) => {
    const result = validateData(schema, item);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push({
        index,
        item,
        errors: result.errors,
      });
    }
  });

  return { valid, invalid };
};

/**
 * Format validation errors for display
 * @param {Array<{path: string, message: string}>} errors - Array of validation errors
 * @returns {string} Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!errors || errors.length === 0) {
    return '';
  }

  return errors
    .map(err => `• ${err.path ? `${err.path}: ` : ''}${err.message}`)
    .join('\n');
};

/**
 * Check if data is valid without returning the parsed data
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {any} data - The data to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValid = (schema, data) => {
  const result = schema.safeParse(data);
  return result.success;
};
