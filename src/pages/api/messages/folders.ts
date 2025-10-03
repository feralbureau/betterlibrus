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

    // Standard Librus folders based on the librus-api config
    // RECEIVED: 6, SENT: 5, and trash uses special API
    const folders = [
      { id: "5", name: "Inbox", count: 0 },    // SENT folder is actually inbox
      { id: "6", name: "Sent", count: 0 },     // RECEIVED folder is actually sent
      { id: "7", name: "Trash", count: 0 }     // Trash folder ID (kosz)
    ];

    // Fix baseURL if not set
    if (!client.caller.defaults.baseURL) {
      client.caller.defaults.baseURL = 'https://synergia.librus.pl';
    }

    // Try to get actual message counts for each folder using standard librus-api
    for (const folder of folders) {
      try {
        const messages = await client.inbox.listInbox(folder.id);
        folder.count = Array.isArray(messages) ? messages.length : 0;
      } catch (error) {
        // Keep count as 0 if we can't fetch
        folder.count = 0;
      }
    }

    return res.status(200).json(folders);
  } catch (error: any) {
    console.error('Message folders API error:', error);
    return res.status(500).json({ message: error.message || "An error occurred." });
  }
}
