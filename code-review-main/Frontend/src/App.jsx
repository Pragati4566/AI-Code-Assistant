import { useState, useEffect } from "react"
import "prismjs/themes/prism-tomorrow.css"
import Editor from "@monaco-editor/react"
import prism from "prismjs"

import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

import axios from "axios"
import "./App.css"

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState("")
  const [language, setLanguage] = useState("javascript")

 
  async function reviewCode() {
    const response = await axios.post("/ai/get-review", {
      code,
      language,
    })
    setReview(response.data)
  }

  return (
    <main>
      <div className="left">
        <div className="code">

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          {/* Code Editor */}
          <Editor
  height="400px"
  language={language}
  value={code}
  onChange={(value) => setCode(value)}
  theme="vs-dark"
  options={{
    automaticLayout: true,
    wordWrap: "on",
    minimap: { enabled: false },
    tabSize: 2,
  }}
/>

        </div>

        <div onClick={reviewCode} className="review">
          Review
        </div>
      </div>

      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review}
        </Markdown>
      </div>
    </main>
  )
}

export default App
