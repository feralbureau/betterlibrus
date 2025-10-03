import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedClient } from "@/lib/librus-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await getAuthenticatedClient(req);
    if (!client) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { folderId, messageId } = req.query;

    if (!folderId || typeof folderId !== "string" || !messageId || typeof messageId !== "string") {
      return res.status(400).json({ message: "Invalid folder ID or message ID" });
    }

    const message = await client.inbox.getMessage(folderId, messageId);

    // Transform the message to match our Message type structure
    const transformedMessage = {
      id: message.id?.toString() || messageId,
      title: message.title || "No Subject",
      content: message.content || "",
      html: message.html || "",
      user: message.user || "Unknown Sender",
      date: message.date || new Date().toISOString().split('T')[0],
      read: message.read || false,
      folderId: message.folderId || folderId,
      files: Array.isArray(message.files) ? message.files.map((file: any) => ({
        name: file.name || "Unknown File",
        path: file.path || ""
      })) : [],
      type: 'message' as const
    };

    return res.status(200).json(transformedMessage);
  } catch (error: any) {
    console.error('Get message API error:', error);
    return res.status(500).json({ message: error.message || "An error occurred." });
  }
}
