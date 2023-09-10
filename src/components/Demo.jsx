import { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/slice/articleSlice";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticle, setAllArticle] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articleFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    articleFromLocalStorage && setAllArticle(articleFromLocalStorage);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticle = [newArticle, ...allArticle];
      setArticle(newArticle);
      setAllArticle(updatedAllArticle);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticle));
      console.log({ newArticle });
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <scetion className="w-full max-w-xl mt-16">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex items-start justify-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 w-5 my-2 ml-3"
          />
          <input
            type="url"
            placeholder="Enter the URL"
            value={article.url}
            onChange={(e) => {
              setArticle({ ...article, url: e.target.value });
            }}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            🏹
          </button>
        </form>

        <div className="flex flex-col gap-1 overflow-y-auto max-h-60">
          {allArticle.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div
                className="copy_btn"
                onClick={() => {
                  handleCopy(item.url);
                }}
              >
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 text-sm font-medium text-blue-700 truncate font-satoshi">
                {item?.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-start justify-center max-w-full my-10">
        {isFetching ? (
          <img src={loader} alt="loader" className="object-contain w-20 h-20" />
        ) : error ? (
          <p className="text-base font-bold text-center font-inter">
            Well, that was not supposed to heppen... <br />{" "}
            <span className="font-normal text-gray-700 font-satoshi">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article?.summary && (
            <div className="flex-col gap-3">
              <h2 className="text-xl font-bold text-gray-600 font-satoshi">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="text-sm font-medium text-gray-700 font-inter">
                  {article?.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </scetion>
  );
};

export default Demo;
