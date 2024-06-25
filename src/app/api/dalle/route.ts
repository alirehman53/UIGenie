

import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
  const headers =  {
    "api-key": process?.env?.API_KEY ?? "", // Replace with your actual token
    "x-ms-api-devportal": "dalle-3", // This is usually the default for POST requests with JSON, but it's good practice to include it
    Accept: "*",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    Origin: "https://tlx-ai-hackathon-2024.developer.azure-api.net",
  }

  const data: any = await req.json()

  const payload = {
    prompt: data?.prompt,
    n: 1,
    size: "1024x1024",
    response_format: "url",
    user: "user123456",
    quality: "standard",
    style: "vivid",
  };

  const resp: any = await fetch("https://tlx-ai-hackathon-2024.azure-api.net/dalle-3/openai/deployments/Dalle3/images/generations?api-version=2024-02-15-preview", {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(payload)
  })
  const result = await resp.json()

  console.log(result)
  return Response.json({ url: result?.data[0]?.url })

}
