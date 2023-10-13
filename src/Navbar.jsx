import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar fixed w-full z-20 top-0 left-0 border-gray-200 dark:border-gray-600">
        <div className=" flex flex-wrap items-center w-[92%] justify-between mx-auto mt-4 p-4">
          <a
            className="flex items-center"
          >
            <span className="cursor-pointer self-center text-[28px] font-bold text-black whitespace-nowrap">
              Summarize.ai
            </span>
          </a>

          <div className="flex items-center justify-between" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
              {window.location.href.includes("/hindi") ? (
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="cursor-pointer block py-2 pl-3 pr-4 text-black text-xl rounded md:text-blue-700 md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    English Summarizer
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => navigate("/hindi")}
                    className="cursor-pointer block py-2 pl-3 pr-4 text-black text-xl rounded md:text-blue-700 md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Hindi Summarizer
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
