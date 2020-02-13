import { FileSystemReader } from './readers/file-system.reader'

export function getRootDirFileNames(): Promise<string[]> {
  return FileSystemReader.readDir(process.cwd())
}
