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

    const { folderId, page = '1', limit = '10' } = req.query;

    if (!folderId || typeof folderId !== "string") {
      return res.status(400).json({ message: "Invalid folder ID" });
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: "Invalid limit (must be 1-100)" });
    }

    // Use the standard inbox method for all folders (including trash)

    // Fix baseURL if not set
    if (!client.caller.defaults.baseURL) {
      client.caller.defaults.baseURL = 'https://synergia.librus.pl';
    }

    const allMessages = await client.inbox.listInbox(folderId);
    const messagesArray = Array.isArray(allMessages) ? allMessages : [];


    // Apply pagination manually
    const totalItems = messagesArray.length;
    const totalPages = Math.ceil(totalItems / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedMessages = messagesArray.slice(startIndex, endIndex);

    const messages = {
      data: paginatedMessages,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: totalItems,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    };

    // Handle both old and new message structure
    let messageData, paginationData;

    if (Array.isArray(messages)) {
      // Legacy format for fallback cases
      messageData = messages;
      paginationData = { currentPage: 1, totalPages: 1, totalItems: messages.length, hasNext: false, hasPrev: false };
    } else {
      // New pagination format
      messageData = messages.data || [];
      paginationData = messages.pagination || { currentPage: 1, totalPages: 0, totalItems: 0, hasNext: false, hasPrev: false };
    }

    // Transform the messages to match our Message type structure
    const transformedMessages = messageData.map((msg: any, index: number) => {
      // Ensure we have a valid numeric ID for operations like deletion
      let messageId = msg.id;
      if (!messageId || isNaN(parseInt(messageId))) {
        messageId = index + 1; // Use 1-based index as fallback
      }

      return {
        id: messageId.toString(),
        title: msg.title || "No Subject",
        content: "", // Content is loaded separately when viewing the message
        html: "",
        user: msg.user || "Unknown Sender",
        date: msg.date || new Date().toISOString().split('T')[0],
        read: msg.read || false,
        folderId: folderId,
        files: [], // Files are loaded when viewing the full message
        type: 'message' as const
      };
    });

    return res.status(200).json({
      messages: transformedMessages,
      pagination: paginationData
    });
  } catch (error: any) {
    console.error('Messages list API error:', error);
    return res.status(500).json({ message: error.message || "An error occurred." });
  }
}
