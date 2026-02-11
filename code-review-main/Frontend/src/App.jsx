import { useState, useEffect, useRef } from "react"
import Editor, { monaco } from "@monaco-editor/react"

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

  // NEW: store AI suggestions temporarily
  const suggestionsRef = useRef([])

  // WebSocket connection (for AI autocomplete)
  useEffect(() => {
    ws = new WebSocket("ws://localhost:3000")

    ws.onopen = () => {
      console.log("WebSocket connected (autocomplete channel)")
    }

    //content coming from the backend
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("WS message:", data)

      // Monaco autocomplete suggestions yahin inject hongi
      if (data.suggestions) {
        suggestionsRef.current = data.suggestions
      }
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

  // NEW: Monaco autocomplete provider
  // Ye function tab chalta hai jab Monaco Editor screen par load ho jata hai
function handleEditorDidMount(monacoInstance) {

  // Monaco ko hum bata rahe hain:
  // "Bhai, is language ke liye custom autocomplete suggestions register karo" 
  monacoInstance.languages.registerCompletionItemProvider(language, {
    // Jab bhi user type karega, Monaco is function ko call karega
    provideCompletionItems: () => {
      return {
        // Yahan hum Monaco ko suggestions ki list de rahe hain
        suggestions: suggestionsRef.current.map((item, index) => ({
          // Ye suggestion ka main text hota hai jo dropdown me dikhega//console.log(10) will be one label and on another line if something is written then that also another label
          label: item,
          // Ye batata hai ki kis type ka suggestion hai (text, function etc)
          kind: monacoInstance.languages.CompletionItemKind.Text,
          // User jab suggestion select karega,
          // tab editor me kya insert hoga
          insertText: item,
          // Chhota sa description jo side me dikhta hai
          detail: "AI Suggestion",
          // Sorting ke liye order decide karta hai (which suggestion first)
          sortText: String(index)
        }))
      }
    }
  })
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

            onMount={handleEditorDidMount}   {/* NEW LINE */} //when editor mount on scren or completely ready then this function will run

            onChange={(value) => {
              setCode(value)

              //AI autocomplete trigger via WebSocket
              if (ws && ws.readyState === WebSocket.OPEN) { //connection open and ws exist
                ws.send( //browseer to backend
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
//why not http with the ai 
/*True – but unavoidable

Because:

AI providers don’t give WebSocket endpoints

They only expose HTTP APIs*/
