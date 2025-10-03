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

    const { path } = req.query;

    if (!path || !Array.isArray(path)) {
      return res.status(400).json({ message: "Invalid file path" });
    }

    // Reconstruct the file path from the array
    const filePath = path.join('/');

    const fileData = await client.inbox.getFile(filePath);

    // The file data should be binary, so we need to handle it appropriately
    // This depends on how librus-api returns the file data
    if (fileData) {
      // Set appropriate headers for file download
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${path[path.length - 1]}"`);

      return res.status(200).send(fileData);
    } else {
      return res.status(404).json({ message: "File not found" });
    }
  } catch (error: any) {
    console.error('File download API error:', error);
    return res.status(500).json({ message: error.message || "An error occurred." });
  }
}
