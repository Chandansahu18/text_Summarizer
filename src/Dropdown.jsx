import { useNavigate } from "react-router-dom";

function Dropdown() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <button
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          className="text-black text-xl text-sm text-center inline-flex items-center"
          type="button"
        >
          Services
        </button>
        {/* Dropdown menu */}
        <div
          id="dropdown"
          className="hover-drop z-10 absolute right-5 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <a
                onClick={() => navigate("/english")}
                className="cursor-pointer block px-4 py-2 
                text-black hover:bg-gray-50 dark:hover:text-black"
              >
                English Summarizer
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/hindi")}
                className="cursor-pointer block px-4 py-2 text-black hover:bg-gray-50 dark:hover:text-black"
              >
                Hindi Summarizer
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dropdown;
