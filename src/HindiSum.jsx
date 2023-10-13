import { useState } from "react";
import Navbar from "./Navbar";
import { AiOutlineCopy } from "react-icons/ai";

function HindiSum() {
  const [Text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [translated2, setTranslated2] = useState("");

  const handleCopyClick = () => {
    if (translated2) {
      navigator.clipboard.writeText(translated2).then(function () {
        alert("Copied!")
      });
    }
  };


  const Translate = async () => {
    setLoading(true);
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
            "6c85eae52dmsha9e57e6fd3ad196p1eb388jsn89da8942907b",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        body: encodedParams,
      };

      const response = await fetch(url, options);
      const result = await response.json();
      await Summarize(result.data.translatedText); // Pass translated text to the next function
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const Translate2 = async (translatedText) => {
    setLoading(false);

    try {
      setLoading(true);
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
            "6c85eae52dmsha9e57e6fd3ad196p1eb388jsn89da8942907b",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        body: encodedParams,
      };

      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      setLoading(false);

      setTranslated2(result.data.translatedText);
    } catch (error) {
      console.error(error);
    }
  };

  const Summarize = async (newdata) => {
    setLoading(false);
    try {
      setLoading(true);
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
          summary_percent: 40,
          text: newdata,
        }),
      };

      const response = await fetch(url, options);
      const result = await response.json();
      setLoading(false);
      console.log(result);
      await Translate2(result.summary);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
       <Navbar />
       <div className="relative flex w-full flex-col items-center top-[12rem]">
        <p className="text-[28px] w-[65%] text-center font-sans font-bold">
          <span className="first-text">Hindi Summarizer</span> - Ideas Amplified:
          Extractive Summarization Excellence
        </p>
        
      </div>
      <div className="relative flex w-full flex-col items-center top-[15.4rem]">
        <div className="english_summarizer rounded-2xl h-[480px] bg-white shadow-xl w-fit flex items-start justify-center">
          <div className="left_textarea flex flex-col items-start">
            <textarea
              className="resize-none w-[680px] text-2xl mt-5 outline-none rounded-tl-2xl p-10 "
              name="input_field"
              cols="30"
              rows="9"
              value={Text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button
              onClick={()=>{
                if (Text.length < 500) {
                  alert(`संक्षेपण के लिए न्यूनतम 500 अक्षर आवश्यक हैं
                  `)
                }
                else{
                  Translate()
                }
              }}
              disabled={Text === "" ? true : false}
              class="bg-blue-500 absolute bottom-0 ml-5 mb-5 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded-lg "
            >
              Summarize
            </button>
          </div>
          <div className="border-gray border-r-4 h-[480px]"></div>
          <div className="right_textarea  flex flex-col">
            <textarea
              className={`resize-none w-[680px] outline-none mt-5  text-2xl rounded-tr-xl rounded-br-xl p-10 ${
                translated2 !== "" ? "" : "pointer-events-none	"
              }`}
              name="output_field"
              value={loading ? "Loading..." : translated2}
              cols="30"
              rows="9"
              onChange={(e) => setTranslated2(e.targetvalue)}
            ></textarea>
            {translated2 !== "" ? <AiOutlineCopy
              fontSize="32px"
              onClick={handleCopyClick}
              color="gray"
              className="cursor-pointer absolute ml-4 bottom-4 "
            /> : ""}
          </div>
        </div>
      </div>
      
    </>
  );
}

export default HindiSum;
