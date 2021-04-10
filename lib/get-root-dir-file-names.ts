import { FileSystemReader } from './readers'

export function getRootDirFileNames(): Promise<string[]> {
  return FileSystemReader.readDir(process.cwd())
}
