import React from 'react';

/**
 * Text formatting utilities
 */

/**
 * Converts text with line breaks (\n) into JSX elements with <br /> tags
 * @param text - The text that may contain \n characters
 * @returns JSX elements with proper line breaks
 */
export const formatTextWithLineBreaks = (text: string) => {
  if (!text) return text;
  
  return text.split('\n').map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
};

/**
 * Converts text with multiple line break patterns into JSX elements
 * Supports \n, \r\n, and actual line breaks
 * @param text - The text that may contain various line break patterns
 * @returns JSX elements with proper line breaks
 */
export const formatTextWithAllLineBreaks = (text: string) => {
  if (!text) return text;
  
  // Replace different line break patterns with \n for consistency
  const normalizedText = text
    .replace(/\r\n/g, '\n')  // Windows line breaks
    .replace(/\r/g, '\n');   // Mac line breaks
  
  return formatTextWithLineBreaks(normalizedText);
};

/**
 * Preserves whitespace and line breaks in text
 * @param text - The text to format
 * @returns Formatted text with preserved spacing
 */
export const preserveTextFormatting = (text: string) => {
  if (!text) return text;
  
  return formatTextWithAllLineBreaks(text);
};