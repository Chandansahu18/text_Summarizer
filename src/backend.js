const xlsx = require("xlsx");
const readlineSync = require("readline-sync");

// Function to read an Excel file and log the entire data to the console
function readExcelFile(filePath) {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);

    // Assume only one sheet for simplicity
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Extract inner data and ignore empty arrays
    const filteredData = jsonData
      .filter(row => Array.isArray(row) && row.length > 0)
      .map(row => row.filter(cell => cell !== undefined))
      .flat(); // Flatten the array

    // Log the extracted data to the console
    if (filteredData.length > 0) {
      console.log("\nExtracted Data from Excel (flattening array and ignoring empty arrays):\n");
    //   console.log(filteredData);
    for (let i = 5; i < 50; i+=3){
        if (filteredData[i] === undefined) {
            return
        }
        console.log(filteredData[i],"\n");
       
    }
    } else {
      console.log("\nNo valid data found in the Excel file.");
    }
  } catch (error) {
    console.error("Error reading the Excel file:", error.message);
  }
}

// Main function
function main() {
  // Get the path to the Excel file from the user
  const filePath = readlineSync.question("Enter the path to the Excel file: ");

  // Read and log the entire data from the Excel file
  readExcelFile(filePath);
}

// Run the script
main();
