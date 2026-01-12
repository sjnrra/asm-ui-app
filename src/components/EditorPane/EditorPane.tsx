// src/components/EditorPane/EditorPane.tsx
import { useEffect, useRef, useState } from "react";

interface EditorPaneProps {
  text: string;
  setText: (text: string) => void;
  onCursorChange?: (position: { line: number; column: number }) => void;
}

export const EditorPane = ({ text, setText, onCursorChange }: EditorPaneProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  const handleCursor = () => {
    const textarea = textareaRef.current;
    if (!textarea || !onCursorChange) return;

    const pos = textarea.selectionStart;
    const before = text.slice(0, pos);
    const line = before.split("\n").length - 1;
    const column = pos - before.lastIndexOf("\n") - 1;
    onCursorChange({ line, column });
  };

  // 行数を計算
  useEffect(() => {
    const lines = text.split("\n");
    setLineCount(lines.length);
  }, [text]);

  // スクロール同期
  const handleScroll = () => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;
    if (textarea && lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  };


  // 行番号を生成
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="editor-pane">
      <div className="panel-header">
        <h3>アセンブラ入力エディタ</h3>
      </div>
      <div className="editor-container">
        <div className="editor-line-numbers" ref={lineNumbersRef}>
          {lineNumbers.map((num) => (
            <div key={num} className="editor-line-number">
              {num}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onClick={handleCursor}
          onKeyUp={handleCursor}
          onKeyDown={handleCursor}
          onScroll={handleScroll}
          className="editor"
          placeholder="z/OSアセンブラコードを入力..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};