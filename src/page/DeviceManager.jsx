import React, { useState } from "react";
import API from "../API";

export default function PalmTester() {
  const [response, setResponse] = useState(null);

  const handleRequest = async (endpoint, method = "post", body = {}) => {
    try {
      let res;
      if (method === "post") {
        res = await API.post(endpoint, body);
      } else {
        res = await API.get(endpoint);
      }
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setResponse({ error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Palm Device Tester</h1>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <button
          onClick={() => handleRequest("/test")}
          className="p-3 bg-blue-500 text-white rounded-xl shadow"
        >
          Test Connection
        </button>

        <button
          onClick={() => handleRequest("/start")}
          className="p-3 bg-green-500 text-white rounded-xl shadow"
        >
          Start Palm
        </button>

        <button
          onClick={() => handleRequest("/state")}
          className="p-3 bg-yellow-500 text-white rounded-xl shadow"
        >
          Get State
        </button>

        <button
          onClick={() => handleRequest("/feature", "post", { user_id: 1 })}
          className="p-3 bg-indigo-500 text-white rounded-xl shadow"
        >
          Get Feature
        </button>

        <button
          onClick={() => handleRequest("/image", "post", { user_id: 1, img_index: 0 })}
          className="p-3 bg-purple-500 text-white rounded-xl shadow"
        >
          Get Image
        </button>

        <button
          onClick={() => handleRequest("/templates", "get")}
          className="p-3 bg-red-500 text-white rounded-xl shadow"
        >
          List Templates
        </button>

        <button
          onClick={() => handleRequest("/images", "get")}
          className="p-3 bg-pink-500 text-white rounded-xl shadow"
        >
          List Images
        </button>
      </div>

      <div className="mt-6 w-full max-w-md bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Response:</h2>
        <pre className="text-sm text-gray-700 bg-gray-100 p-2 rounded overflow-x-auto">
          {response ? JSON.stringify(response, null, 2) : "No response yet"}
        </pre>
      </div>
    </div>
  );
}
