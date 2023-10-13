import { useState } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import Navbar from "./Navbar";

function EnglishSum() {
  const [Text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const Summarize = async () => {
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
            "ad4920664fmsh4fcdf78fcf1255cp1bb34fjsn4be2df40d4ef",
          "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
        },
        body: JSON.stringify({
          language: "english",
          summary_percent: 40,
          text: Text,
        }),
      };

      const response = await fetch(url, options);
      const result = await response.json();
      setLoading(false);
      console.log(result);
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyClick = () => {
    if (summary) {
      navigator.clipboard.writeText(summary).then(function () {
        alert("Copied!")
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative flex w-full flex-col items-center top-[12rem]">
        <p className="text-[28px] w-[65%] text-center font-sans font-bold">
          <span className="first-text">English Summarizer</span> - Ideas Amplified:
          Extractive Summarization Excellence
        </p>
        
        
      </div>
      <div className="relative flex w-full flex-col items-center top-[15.4rem]">
        <div className="english_summarizer h-[480px] bg-white shadow-xl w-fit rounded-2xl flex items-start justify-center">
          <div className="left_textarea  flex flex-col items-start">
            <textarea
              className="resize-none w-[680px] text-2xl mt-5 outline-none rounded-tl-2xl p-10 "
              name="input_field"
              cols="30"
              rows="9"
              value={Text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button
            disabled={Text === "" ? true : false}
              onClick={()=>{
                if (Text.length < 500) {
                  alert("Minimum 500 characters need to summarize.")
                }
                else{
                  Summarize()
                }
              }}
              class="bg-blue-500 absolute bottom-0 ml-5 mb-5 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded-lg "
            >
              Summarize
            </button>
          </div>
          <div className="border-gray border-r-4 h-[480px]"></div>
          <div className="right_textarea  flex flex-col">
            <textarea
              className={`resize-none w-[680px] outline-none mt-5  text-2xl rounded-tr-xl rounded-br-xl p-10 ${
                summary !== "" ? "" : "pointer-events-none	"
              }`}
              name="output_field"
              value={loading ? "Loading..." : summary}
              cols="30"
              rows="9"
              onChange={(e) => setSummary(e.targetvalue)}
            ></textarea>
            {summary !== "" ? <AiOutlineCopy
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

export default EnglishSum;
