/**
 * Input Sanitization Utility
 * Uses DOMPurify for XSS protection on user-generated content
 * 
 * Usage:
 * import { sanitizeHtml, sanitizeText, sanitizeUserInput } from '@/lib/sanitize'
 * 
 * const cleanHtml = sanitizeHtml(userInput)  // For rich content
 * const cleanText = sanitizeText(userInput)  // Plain text only
 * const cleanInput = sanitizeUserInput(userInput)  // General inputs
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content - allows safe HTML tags
 * Use for: Rich text editors, formatted content
 */
export function sanitizeHtml(dirty: string): string {
    if (!dirty || typeof dirty !== 'string') return '';

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: ['target'], // Allow target attribute for links
    });
}

/**
 * Strip all HTML - returns plain text only
 * Use for: Chat messages, comments, user names
 */
export function sanitizeText(dirty: string): string {
    if (!dirty || typeof dirty !== 'string') return '';

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [],  // No HTML allowed
        ALLOWED_ATTR: []
    });
}

/**
 * General user input sanitization
 * Removes dangerous content while preserving basic formatting
 * Use for: Forum posts, product descriptions, bios
 */
export function sanitizeUserInput(dirty: string): string {
    if (!dirty || typeof dirty !== 'string') return '';

    // First, decode any HTML entities that might be used to bypass filters
    const decoded = dirty
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&');

    return DOMPurify.sanitize(decoded, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: [],
        FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'object', 'embed', 'link'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
    });
}

/**
 * Sanitize object - recursively sanitizes all string values in an object
 * Use for: Request body sanitization
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeText(value);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'string' ? sanitizeText(item) : item
            );
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';

    // Remove any HTML/scripts first
    const clean = sanitizeText(email).trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(clean) ? clean : '';
}

/**
 * Sanitize search query - prevents injection
 */
export function sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== 'string') return '';

    return sanitizeText(query)
        .trim()
        .slice(0, 200)  // Limit length
        .replace(/[<>\"']/g, ''); // Remove potential injection chars
}
