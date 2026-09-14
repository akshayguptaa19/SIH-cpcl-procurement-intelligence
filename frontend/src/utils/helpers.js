import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Pure JavaScript React element constructor.
 * Strict alternative to JSX syntax.
 */
export function h(type, props, ...children) {
  return React.createElement(type, props, ...children);
}

/**
 * Merges Tailwind classes cleanly with clsx.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers into Indian currency format (e.g. ₹42.50 Cr or ₹1.80 L).
 */
export function formatINR(val, inCrores = false) {
  if (val === null || val === undefined) return '₹0';
  if (inCrores) {
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Cr';
  }
  return '₹' + Number(val).toLocaleString('en-IN');
}

/**
 * Formats date string to DD MMM YYYY.
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
}

/**
 * Truncates text with ellipsis.
 */
export function truncate(text, length = 32) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Copies text to clipboard safely.
 */
export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.resolve();
}
