import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"

import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

import axios from "axios"
import "./App.css"

let ws //  WebSocket reference (global)

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState("")
  const [language, setLanguage] = useState("javascript")

  // WebSocket connection (for AI autocomplete)
   useEffect(() => {
    ws = new WebSocket("ws://localhost:3000")

    ws.onopen = () => {
      console.log("WebSocket connected (autocomplete channel)")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("WS message:", data)

      // Monaco autocomplete suggestions yahin inject hongi
    }

    ws.onclose = () => {
      console.log(" WebSocket disconnected")
    }

    return () => {
      ws.close()
    }
  }, [])

  //  Normal HTTP API (code review)
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

          {/* Monaco Editor */}
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={(value) => {
            setCode(value)

              //AI autocomplete trigger via WebSocket
              if (ws && ws.readyState === WebSocket.OPEN) { //connection open and ws exist
                ws.send( //server is giving to browser
                  JSON.stringify({
                    type: "code_change",
                    language,
                    code: value,
                  })
                )
              }
            }}
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
/*True – but unavoidable

Because:

AI providers don’t give WebSocket endpoints

They only expose HTTP APIs*/
