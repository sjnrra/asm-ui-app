/**
 * 外部ファイル管理モジュール
 * ブラウザ環境でのファイル読み込みと管理を担当
 */

export interface SourceFile {
  name: string;
  content: string;
  path?: string; // 相対パス（将来の拡張用）
}

export class FileManager {
  private files: Map<string, SourceFile> = new Map();

  /**
   * ファイルを追加
   */
  addFile(name: string, content: string, path?: string): void {
    this.files.set(name.toUpperCase(), {
      name,
      content,
      path,
    });
  }

  /**
   * ファイルを取得
   */
  getFile(name: string): SourceFile | undefined {
    return this.files.get(name.toUpperCase());
  }

  /**
   * ファイルが存在するかチェック
   */
  hasFile(name: string): boolean {
    return this.files.has(name.toUpperCase());
  }

  /**
   * すべてのファイルを取得
   */
  getAllFiles(): SourceFile[] {
    return Array.from(this.files.values());
  }

  /**
   * ファイルを削除
   */
  removeFile(name: string): void {
    this.files.delete(name.toUpperCase());
  }

  /**
   * すべてのファイルをクリア
   */
  clear(): void {
    this.files.clear();
  }

  /**
   * ファイル名を正規化（拡張子なしの名前を返す）
   * 例: "MYMACRO.MAC" -> "MYMACRO"
   */
  normalizeFileName(name: string): string {
    // 拡張子を除去（.MAC, .ASM, .INCなど）
    return name.replace(/\.[^.]+$/, "").toUpperCase();
  }

  /**
   * 複数の候補からファイルを検索
   * 例: "MYMACRO" -> "MYMACRO", "MYMACRO.MAC", "MYMACRO.ASM" などを検索
   */
  findFile(name: string): SourceFile | undefined {
    const normalized = this.normalizeFileName(name);
    
    // 直接一致
    if (this.hasFile(name)) {
      return this.getFile(name);
    }
    
    // 正規化された名前で検索
    if (this.hasFile(normalized)) {
      return this.getFile(normalized);
    }
    
    // 拡張子を追加して検索
    const extensions = [".MAC", ".ASM", ".INC", ".MACLIB"];
    for (const ext of extensions) {
      const nameWithExt = normalized + ext;
      if (this.hasFile(nameWithExt)) {
        return this.getFile(nameWithExt);
      }
    }
    
    // すべてのファイル名から部分一致を検索
    for (const [key, file] of this.files.entries()) {
      const keyNormalized = this.normalizeFileName(key);
      if (keyNormalized === normalized) {
        return file;
      }
    }
    
    return undefined;
  }
}
