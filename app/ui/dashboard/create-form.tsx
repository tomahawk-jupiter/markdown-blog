"use client";

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import DOMPurify from "dompurify";
import { useState, useEffect } from "react";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export default function Form() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    async function convertMarkdownToHtml() {
      const parsedMarkdown = await marked.parse(markdownContent);
      const sanitizedHtml = DOMPurify.sanitize(parsedMarkdown);
      setHtmlContent(sanitizedHtml);
    }

    convertMarkdownToHtml();
  }, [markdownContent]);

  const createMarkup = (content: string) => {
    return { __html: content };
  };

  return (
    <div>
      <form>
        <textarea
          onChange={(e) => setMarkdownContent(e.target.value)}
          name=""
          id=""
          cols={30}
          rows={10}
          value={markdownContent}
        ></textarea>
      </form>

      <div>
        <strong>Preview</strong>
      </div>

      {htmlContent && (
        <div dangerouslySetInnerHTML={createMarkup(htmlContent)}></div>
      )}
    </div>
  );
}
