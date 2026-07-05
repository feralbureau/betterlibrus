import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedClient } from "@/lib/librus-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await getAuthenticatedClient(req);
    if (!client) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const accountInfo = await client.info.getAccountInfo();

    let userInfo: any = {};
    try {
      if (client.info.getUser && typeof client.info.getUser === 'function') {
        userInfo = await client.info.getUser();
      }
    } catch (userError: any) {
      // user info is optional
    }

    let studentInfo: any = {};
    try {
      if (client.info.getStudentInfo && typeof client.info.getStudentInfo === 'function') {
        studentInfo = await client.info.getStudentInfo();
      }
    } catch (studentError: any) {
      // student info is optional
    }

    const accountData = accountInfo as any;
    const studentData = accountData?.student || {};
    const accountInfoData = accountData?.account || {};

    const combinedUserData = {
      email: accountInfoData?.login || null,
      name: studentData?.nameSurname || accountInfoData?.nameSurname || null,
      id: studentData?.index || null,
      firstName: null as string | null,
      lastName: null as string | null,
      phone: userInfo?.phone || userInfo?.phoneNumber || null,
      address: userInfo?.address || null,
      class: studentData?.class || null,
      studentId: studentData?.index || null,
      enrollmentDate: studentInfo?.enrollmentDate || null,
      educator: studentData?.educator || null,
      fullName: studentData?.nameSurname || accountInfoData?.nameSurname || null
    };

    if (combinedUserData.fullName && combinedUserData.fullName.includes(' ')) {
      const nameParts = combinedUserData.fullName.split(' ');
      combinedUserData.firstName = nameParts[0];
      combinedUserData.lastName = nameParts.slice(1).join(' ');
    }

    return res.status(200).json({ 
      success: true, 
      user: combinedUserData,
      debug: {
        accountInfo,
        userInfo,
        studentInfo
      }
    });
  } catch (error: any) {
    console.error('🔥 User API error:', error);
    return res.status(500).json({ message: error.message || "An error occurred." });
  }
}
