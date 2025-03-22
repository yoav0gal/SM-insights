import * as fs from "fs";
import * as path from "path";

/**
 * Saves an array of objects as a CSV file.
 *
 * @param data - The array of objects to save as CSV.
 * @param filePath - The full file path (including file name) where the CSV should be saved.
 */
export function saveArrayToCSV(
  data: Record<string, any>[],
  filePath: string
): void {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("The data array is empty or not valid.");
  }

  // Get the headers from the keys of the first object
  const headers = Object.keys(data[0]);

  // Convert array to CSV format
  const csvRows: string[] = [];
  csvRows.push(headers.join(",")); // Add header row

  for (const row of data) {
    const rowValues = headers.map((header) => {
      const value = row[header];
      // Escape values with quotes if they contain commas, quotes, or newlines
      if (typeof value === "string" && /[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? ""; // Handle null/undefined as empty string
    });
    csvRows.push(rowValues.join(","));
  }

  // Join rows with newlines
  const csvContent = csvRows.join("\n");

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write CSV content to file
  fs.writeFileSync(filePath, csvContent, "utf-8");
  console.log(`CSV file saved to ${filePath}`);
}
