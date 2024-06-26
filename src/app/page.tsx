"use client";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChangeEvent, useState } from "react";
import CodeDisplay from "./components/CodeDisplay";
import { getImageFromText } from "./utils/Api";
import OpenAI from "openai";
import Loader from "./components/loader";
import { insertPrompt } from "./utils/prompt";
import HtmlCssPreviewer from "./components/HtmlCssPreviewer";

const extractBodyContent = (htmlString: string) => {
  const bodyContentMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyContentMatch ? bodyContentMatch[1] : null;
};

const extractCssContent = (cssString: string) => {
  const cssContentMatch = cssString.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  return cssContentMatch ? cssContentMatch[1].trim() : null;
};

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
  const [codeLoading, setCodeLoading] = useState<boolean>(false);
  const [designLoading, setDesignLoading] = useState<boolean>(false);
  const [isGen, setIsGen] = useState<boolean>(false);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const genCode = async (revisedPrompt: string) => {
    const result = await model.generateContent(
      `${revisedPrompt}. Generate Html and CSS code, and avoid adding javascript code for the UI Description. Styling should be in head tag. Provide Just the Code`
    );
    const response = await result.response;
    const text = response.text();
    setCodeContent(text);
    setCodeLoading(false);
    setIsGen(true);
  };

  const getUiDesignFromPrompt = async () => {
    // `write a brief prompt for creating optimal, simple UI design. prompt should be in one paragraph. ${prompt}`
    const result = await model.generateContent(`${insertPrompt(prompt)}. Design should be for web application`);
    const response = await result.response;
    const text = response.text();
    genCode(text);
    setPromptForImg(text);

    const payload = {
      prompt: text,
      n: 1,
      size: "1024x1024",
      response_format: "url",
      user: "user123456",
      quality: "standard",
      style: "vivid",
    };

    const image_url: string | undefined = await getImageFromText(
      payload,
      setDesignLoading
    );
    console.log(image_url);
    setGenImg(image_url);
  };

  const handleChange = (e: ChangeEvent) => {
    const target = e?.target as HTMLInputElement;
    setPrompt(`${target?.value}`);
  };

  const handleClickGen = () => {
    if (prompt.length > 0 && prompt != null) {
      setCodeLoading(true);
      setDesignLoading(true);
      getUiDesignFromPrompt();
    }
  };

  const isLoading = () => {
    return codeLoading || designLoading;
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
              flexDirection: "column",
              gap: "1.5rem",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <div style={{ width: "100%" }}>
              <label style={{ marginBottom: "0.5rem" }}>
                UI Design{" "}
                <span style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                  (preview of the generated code)
                </span>
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {isGen && !codeLoading ? (
                  <HtmlCssPreviewer
                    html={extractBodyContent(codeContent)}
                    css={extractCssContent(codeContent)}
                  />
                ): (
                  <CodeDisplay codeContent={""} />
                )}
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ marginBottom: "0.5rem" }}>UI Code</label>
              <CodeDisplay codeContent={codeContent} />
            </div>
            {genImg != null && genImg != "" && (
              <div style={{width: "100%"}}>
                <label style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}>
                  Some More UI Design Suggestion
                </label>
                <img
                  style={{ borderRadius: "0.5rem" }}
                  src={genImg}
                  alt="Picture UI Design"
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
