// src/components/panels/FilesPanel.tsx
import type { SourceFile } from "../../core/FileManager";

interface FilesPanelProps {
  files: SourceFile[];
}

export const FilesPanel = ({ files }: FilesPanelProps) => {
  return (
    <div className="files-panel">
      <div className="panel-header">
        <h3>読み込み済みファイル</h3>
      </div>
      {files.length === 0 ? (
        <div className="empty-state">
          <p>読み込み済みファイルがありません</p>
          <small>依存ファイルは public/dependencies/ から自動読み込みされます</small>
        </div>
      ) : (
        <div className="files-list">
          {files.map((file, idx) => (
            <div key={idx} className="file-item">
              <div className="file-name">
                <span className="file-icon">📄</span>
                <span className="file-name-text" title={`ファイル名: ${file.name}`}>
                  {file.name}
                </span>
              </div>
              <div className="file-info">
                <small className="file-size">
                  {file.content.length.toLocaleString()} 文字
                </small>
                {file.path && (
                  <small className="file-path" title={`パス: ${file.path}`}>
                    {file.path}
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
