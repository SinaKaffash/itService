import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowed = new Map([["application/pdf", ".pdf"], ["image/png", ".png"], ["image/jpeg", ".jpg"], ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"], ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"], ["application/zip", ".zip"], ["application/x-zip-compressed", ".zip"]]);
export const uploadDirectory = () => path.resolve(process.env.UPLOADS_DIR || "uploads");
export async function storeUpload(file: File) { const extension = allowed.get(file.type); if (!extension || file.size <= 0 || file.size > 10 * 1024 * 1024) throw new Error("INVALID_ATTACHMENT"); const storageName = `${randomUUID()}${extension}`; await mkdir(uploadDirectory(), { recursive: true }); await writeFile(path.join(uploadDirectory(), storageName), Buffer.from(await file.arrayBuffer()), { flag: "wx" }); return { originalName: path.basename(file.name).slice(0, 200), storageName, mimeType: file.type, size: file.size }; }
export async function removeUploads(names: string[]) { await Promise.all(names.map(name => unlink(path.join(uploadDirectory(), name)).catch(() => undefined))); }
