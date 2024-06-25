"use client";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./index.scss"

export default function CodeDisplay({ codeContent }: { codeContent: string}) {
  useEffect(() => {}, []);

  return (
    <div className="code-container">
      <SyntaxHighlighter language="typescript" style={docco}>
        {codeContent}
      </SyntaxHighlighter>
    </div>
  );
}
