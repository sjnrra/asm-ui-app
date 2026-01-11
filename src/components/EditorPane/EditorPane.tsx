// src/components/EditorPane/EditorPane.tsx
import { useEffect, useRef } from "react";

interface EditorPaneProps {
  text: string;
  setText: (text: string) => void;
  onCursorChange?: (position: { line: number; column: number }) => void;
}

export const EditorPane = ({ text, setText, onCursorChange }: EditorPaneProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCursor = () => {
    const textarea = textareaRef.current;
    if (!textarea || !onCursorChange) return;

    const pos = textarea.selectionStart;
    const before = text.slice(0, pos);
    const line = before.split("\n").length - 1;
    const column = pos - before.lastIndexOf("\n") - 1;
    onCursorChange({ line, column });
  };

  // フォントを等幅に設定（z/OSの固定カラム形式に対応）
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.fontFamily = "'Consolas', 'Monaco', 'Courier New', monospace";
      textareaRef.current.style.fontSize = "14px";
      textareaRef.current.style.lineHeight = "1.6";
    }
  }, []);

  return (
    <div className="editor-pane">
      {/* <div className="editor-header">
        <span className="editor-title">アセンブリソース</span>
        <span className="editor-info">固定カラム形式（1-80カラム）</span>
      </div> */}
      <div className="panel-header">
        <h3>アセンブリソース入力エディタ</h3>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClick={handleCursor}
        onKeyUp={handleCursor}
        onKeyDown={handleCursor}
        className="editor"
        placeholder="z/OSアセンブラコードを入力..."
        spellCheck={false}
      />
    </div>
  );
};