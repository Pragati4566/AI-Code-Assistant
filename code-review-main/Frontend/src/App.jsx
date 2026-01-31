import { useState, useEffect } from "react"
import "prismjs/themes/prism-tomorrow.css"

import Editor from "react-simple-code-editor"
import prism from "prismjs"

// Prism languages
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-java"

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
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              prism.highlight(
                code,
                prism.languages[language] || prism.languages.javascript,
                language
              )
            }
            padding={10}
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
