/**
 * Format a number as currency string (e.g. for display).
 * Uses Thai locale; adjust as needed.
 */
export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("th-TH", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

/**
 * Parse a currency string (e.g. from input) to number.
 * Handles commas, spaces, and common decimal separators.
 */
export function parseCurrency(input: string): number {
	const cleaned = String(input || "0")
		.replace(/\s/g, "")
		.replace(/,/g, "");
	const parsed = parseFloat(cleaned);
	return Number.isNaN(parsed) ? 0 : parsed;
}
