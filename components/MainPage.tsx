"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function SubmitHandler() {
    if (!url) {
      setMessage("Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: { url },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to download the video.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const encodedTitle = response.headers.get("X-Video-Title");
      const videoTitle = encodedTitle ? decodeURIComponent(encodedTitle) : "downloaded-video";
      a.download = `${videoTitle}.mp4`
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setMessage("Download started successfully!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while downloading. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="url"
        placeholder="Enter YouTube URL"
        className="w-6/12 text-black p-2 m-5 outline-none rounded-lg"
        onChange={(e) => setUrl(e.target.value)}
        value={url}
      />
      <button
        className="bg-white text-black p-2 rounded-md"
        onClick={SubmitHandler}
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download"}
      </button>
      {message && <p className="text-white mt-4">{message}</p>}
    </div>
  );
}
