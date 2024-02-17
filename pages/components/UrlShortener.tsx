import { constants } from "@/utils/constantsUtil";
import axios from "axios";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import QRCode from "react-qr-code";

interface UrlFormValidator {
  url: string;
}

const UrlShortener = () => {
  const [tabIndex, setTabIndex] = useState(1);
  const [url, setUrl] = useState(null);
  const { register, handleSubmit, reset } = useForm<UrlFormValidator>();
  const onUrlShortenerSubmit: SubmitHandler<UrlFormValidator> = async (
    data
  ) => {
    console.log("Submitted");
    await axios.post("/api/createShortenedUrl", data).then((res) => {
      reset({
        url: constants.LOCAL_DOMAIN + "/api/redirectToUrl/" + res.data.uniqueId,
      });
    });
  };

  const onQrGeneratorSubmit = async (data: any) => {
    setUrl(data.url);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center gap-6">
        <span
          className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm p-2 text-center me-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900 cursor-pointer"
          onClick={() => setTabIndex(1)}
        >
          Shorten URL
        </span>
        <span
          className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm p-2 text-center me-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900 cursor-pointer"
          onClick={() => setTabIndex(2)}
        >
          QR Generator
        </span>
      </div>
      <div>
        {tabIndex === 1 ? (
          <>
            <form
              className="flex gap-4 items-center"
              onSubmit={handleSubmit(onUrlShortenerSubmit)}
            >
              <div className="flex gap-2 items-center">
                <label>URL</label>
                <input
                  className="p-2 text-xs focus:ring-4 focus:outline-none w-96"
                  {...register("url")}
                  type="url"
                />
              </div>
              <button
                type="submit"
                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm p-2 text-center me-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
              >
                Shorten URL
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col justify-center gap-6">
            <form
              className="flex gap-4 items-center"
              onSubmit={handleSubmit(onQrGeneratorSubmit)}
            >
              <div className="flex gap-2 items-center">
                <label>URL</label>
                <input
                  className="p-2 text-xs focus:ring-4 focus:outline-none w-96"
                  {...register("url")}
                  type="url"
                />
              </div>
              <button
                type="submit"
                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm p-2 text-center me-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
              >
                Generate QR
              </button>
            </form>
            {url && (
              <div className="flex justify-center">
                <QRCode value={url!} />{" "}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
