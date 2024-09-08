"use client"

import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  async function SubmitHandler() {
    const response = await axios.post("/api/download", {
      body: {
        url
      }
    })
  }
    return (
      <div>
        <input type="url" placeholder="Enter URL" className="w-6/12 text-black p-2 m-5 outline-none rounded-lg" onChange={e => setUrl(e.target.value)} />
        <button className="bg-white text-black p-2 rounded-md" onClick={SubmitHandler}>Download</button>
      </div>
    );
  }