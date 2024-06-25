

import React, { useEffect, useRef } from 'react';

const HtmlCssPreviewer = ({ html, css }: any) => {
  const iframeRef: any = useRef(null);

  useEffect(() => {
    const document = iframeRef?.current?.contentDocument;
    const documentContents = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css}</style>
      </head>
      <body>${html}</body>
      </html>
    `;
    document.open();
    document.write(documentContents);
    document.close();
  }, [html, css]);

  return <iframe title="HTML and CSS Previewer" ref={iframeRef} style={{ width: '100%', height: '100vh', border: 'none', background: 'white', borderRadius: '0.5rem' }} />;
};

export default HtmlCssPreviewer;
