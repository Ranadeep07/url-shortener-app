import { constants } from "@/utils/constantsUtil";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface UrlFormValidator {
  url: string;
}

const UrlShortener = () => {
  const { register, handleSubmit, reset } = useForm<UrlFormValidator>();
  const onSubmit: SubmitHandler<UrlFormValidator> = async (data) => {
    console.log("Submitted");
    await axios.post("/api/createShortenedUrl", data).then((res) => {
      reset({
        url:
          constants.LOCAL_DOMAIN + "/api/redirectToUrl/" + res.data.uniqueId,
      });
    });
  };

  return (
    <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2">
        <label>URL</label>
        <input
          className="p-2 text-xs focus:ring-4 focus:outline-none w-96"
          {...register("url")}
        />
      </div>
      <button
        type="submit"
        className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
      >
        Shorten URL
      </button>
    </form>
  );
};

export default UrlShortener;
