"use client";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChangeEvent, useState } from "react";
import CodeDisplay from "./components/CodeDisplay";
import { getImageFromText } from "./utils/Api";
import OpenAI from "openai";
import Loader from "./components/loader";

export default function Home() {
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAw9We5-vb9wM13dkDdy1KGXAOFVT1WFfc"
  );
  const [prompt, setPrompt] = useState("");
  const [promptForImg, setPromptForImg] = useState("");
  const [codeContent, setCodeContent] = useState("");
  const [genImg, setGenImg] = useState<string | undefined>("");
  const [codeLoading, setCodeLoading] = useState<boolean>(false)
  const [designLoading, setDesignLoading] = useState<boolean>(false)

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const genCode = async (engineeredPrompt: string) => {
    const result = await model.generateContent(
      `${engineeredPrompt}. Generate Html and CSS code for the UI Description. Just the Code`
    );
    const response = await result.response;
    const text = response.text();
    setCodeContent(text);
    setCodeLoading(false)
  };

  const getUiDesignFromPrompt = async () => {
    const result = await model.generateContent(
      `write dalle 3 prompt for creating  optimal, simple and eye catching UI. prompt should be in one paragraph. ${prompt}`
    );
    const response = await result.response;
    const text = response.text();
    console.log("generated prompt: ", text)
    setPromptForImg(text);

    genCode(text)

    const payload = {
      prompt: text,
      n: 1,
      size: "1024x1024",
      response_format: "url",
      user: "user123456",
      quality: "standard",
      style: "vivid",
    };

    const image_url: string | undefined = await getImageFromText(payload);
    console.log(image_url);
    setGenImg(image_url);
    setDesignLoading(false)
  };

  const handleChange = (e: ChangeEvent) => {
    const target = e?.target as HTMLInputElement;
    setPrompt(`${target?.value}`);
  };

  const handleClickGen = () => {
    if (prompt.length > 0 && prompt != null) {
      setCodeLoading(true)
      setDesignLoading(true)
      getUiDesignFromPrompt();
    }
  };

  const isLoading = () => {
    return codeLoading || designLoading ;
  };

  return (
    <div style={{ width: "100%" }}>
      <h2 className="title">UI Genie</h2>
      <main
        className="flex min-h-screen flex-col items-center p-12"
        style={{ width: "100%" }}
      >
        <label>Enter your UI Description:</label>
        <div style={{ width: "100%", textAlign: "center" }}>
          <input
            type="text"
            id="input-field"
            name="input-field"
            placeholder="Type something..."
            onChange={handleChange}
          />
          <button
            className="button4"
            onClick={handleClickGen}
            disabled={prompt.length <= 0}
          >
            Generate
          </button>
        </div>

        {isLoading() ? (
          <Loader />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <div style={{ width: "50%" }}>
              <label style={{ marginBottom: "0.5rem" }}>UI Design</label>
              {genImg != null && genImg != "" ? (
                <img
                  style={{ borderRadius: "0.5rem" }}
                  src={genImg}
                  width={500}
                  height={500}
                  alt="Picture UI Design"
                />
              ) : (
                <CodeDisplay codeContent={""} />
              )}
            </div>
            <div style={{ width: "50%" }}>
              <label style={{ marginBottom: "0.5rem" }}>UI Code</label>
              <CodeDisplay codeContent={codeContent} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
