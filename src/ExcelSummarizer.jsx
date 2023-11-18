import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Navbar from "./Navbar";

function ExcelSummarizer() {
  const [translated2, setTranslated2] = useState([]);
  const [extractedData, setExtracted] = useState([]);
  const [TitleData, setTitleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStart, setLoadingStart] = useState("");

  useEffect(() => {
    // Log the updated state
    console.log(translated2);
    if (translated2 && translated2.length > 0) {
      setLoading(false);
      setLoadingStart("ended");
    }
  }, [translated2]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      setLoading(true);
      setLoadingStart("started");

      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });

          // Assume only one sheet for simplicity
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convert sheet data to JSON
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Filter out arrays with length 0
          const filteredData = jsonData.filter(
            (row) => Array.isArray(row) && row.length > 0
          );

          // Log the parsed data to the console
          if (filteredData.length > 0) {
            const newData = filteredData.map((element) =>
              element[2] === "Story" ? null : element[2]
            );
            const firstData = filteredData.map((element) =>
              element[1] === "Title" ? null : element[1]
            );
            setTitleData(firstData);
            console.log(newData);
            setExtracted(newData);

            // Iterate over each element in newData and send it to Translate function
            newData.forEach((text) => {
              if (text !== null) {
                Translate(text);
              }
            });
          } else {
            console.log("No valid data found in the Excel file.");
          }
        } catch (error) {
          console.error("Error parsing the Excel file:", error.message);
        }
      };

      reader.readAsBinaryString(selectedFile);
    } else {
      console.log("No file selected.");
    }
  };

  const Translate = async (Text) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set("source_language", "hi");
      encodedParams.set("target_language", "en");
      encodedParams.set("text", Text);

      const url = "https://text-translator2.p.rapidapi.com/translate";
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "cde3527173mshb8e475909a52a92p19fd86jsn06e22de375a2",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        body: encodedParams,
      };

      const response = await fetch(url, options);
      const result = await response.json();

      // Add a 5-second delay
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await Summarize(result.data.translatedText, Text);
    } catch (error) {
      console.error(error);
    }
  };

  const Summarize = async (newdata, originalText) => {
    try {
      const url =
        "https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1";
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "6c85eae52dmsha9e57e6fd3ad196p1eb388jsn89da8942907b",
          "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
        },
        body: JSON.stringify({
          language: "english",
          summary_percent: 60,
          text: newdata,
        }),
      };

      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result.summary);

      await Translate2(result.summary, originalText);
    } catch (error) {
      console.error(error);
    }
  };

  const Translate2 = async (translatedText, originalText) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set("source_language", "en");
      encodedParams.set("target_language", "hi");
      encodedParams.set("text", translatedText);

      const url = "https://text-translator2.p.rapidapi.com/translate";
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "cde3527173mshb8e475909a52a92p19fd86jsn06e22de375a2",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        body: encodedParams,
      };

      const response = await fetch(url, options);
      const result = await response.json();
      setTranslated2((prevData) => [
        ...prevData,
        { translatedText: result.data.translatedText, originalText },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    if (
      translated2.length > 0 &&
      extractedData.length > 0 &&
      TitleData.length > 0
    ) {
      // Create worksheet for the translated data with serial number
      const translatedSheet = translated2.map(
        ({ translatedText, originalText }) => ({
          Story: originalText,
          Summary: translatedText,
        })
      );

      // Sort the translated sheet based on the original story order
      translatedSheet.sort((a, b) => {
        const aIndex = extractedData.findIndex((title) => title === a.Story);
        const bIndex = extractedData.findIndex((title) => title === b.Story);
        return aIndex - bIndex;
      });

      // Create a new workbook and add the translated sheet
      const wb = XLSX.utils.book_new();
      const translatedWs = XLSX.utils.json_to_sheet(translatedSheet, {
        header: ["Story", "Summary"],
      });

      XLSX.utils.book_append_sheet(wb, translatedWs, "TranslatedData");

      // Convert the workbook to Excel file binary data
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      // Convert binary data to blob
      const blob = new Blob([s2ab(excelBuffer)], {
        type: "application/octet-stream",
      });

      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "outputData.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Convert binary string to array buffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  return (
    <>
      <Navbar />
      <div className="relative flex w-full flex-col items-center top-[12rem]">
        <p className="text-[28px] w-[65%] text-center font-sans font-bold">
          <span className="first-text">Data-Set Summarizer</span> - Summarize your data in Bulk
        </p>
        
        {loading === true && loadingStart === "started" || loadingStart === "ended" ? "" : <div className="flex items-center justify-center w-full mt-14">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col backdrop-blur-10 items-center justify-center w-fit p-10 px-24 h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-200/[.7]"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-800">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".xls, .xlsx"
            />
          </label>
        </div>}

        {loading === true && loadingStart === "started" ? (
          <div className="text-center relative top-24">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-400 animate-spin dark:text-gray-400 fill-blue-600 w-[60px] h-[60px]"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <p className="font-sans font-semibold relative top-5 text-xl">Your data is summarizing... Please wait!</p>
            </div>
          </div>
        ) : (
          ""
        )}

        {translated2 && translated2.length > 0 ? (
            
         <>
         <img src="Excel.png" alt="excel" className="w-[160px] h-[160px] relative top-8 right-3" />
         <p className="font-mono  text-xl text-center font-semibold mt-6">Your summarized data-set is ready to download!</p>
          <button
            type="button"
            onClick={handleDownload}
            class="relative top-6 focus:outline-none text-white bg-blue-760 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border-none"
          >
            Download File
          </button>
         </>
        ) : (
          ""
        )}
      </div>
      {/* <div className="relative flex w-full flex-col items-center top-[12rem]">
        <input
          type="file"
          name=""
          id=""
          accept=".xls, .xlsx"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleDownload}
          class="mt-6 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Download data
        </button>
      </div> */}

      {/* DROPONE */}
    </>
  );
}

export default ExcelSummarizer;
