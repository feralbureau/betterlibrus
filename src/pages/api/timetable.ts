import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedClient } from "@/lib/librus-client";
import * as cheerio from 'cheerio';
import Librus from "librus-api";
import FormData from "form-data";


async function getTimetable(client: Librus, from?: string, to?: string) {
  const days = [
    "d1", "d2", "d3", "d4", "d5", "d6", "d7",
  ];

  if (!from || !to) {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    const daysFromMonday = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(today.getDate() + daysFromMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    from = monday.toISOString().split('T')[0];
    to = sunday.toISOString().split('T')[0];
  }

  let parser = ($, row) => {
    if ($(row).hasClass("line0")) {
      return null;
    }
    let hour = $(row).find("th").text().trim();
    let lessonCells = $(row).find("td").slice(1, -1);
    let list = [];
    lessonCells.each((index, cell) => {
      let $cell = $(cell);
      let textDiv = $cell.find(".text");
      if (textDiv.length > 0 && textDiv.text().trim()) {
        let subject = textDiv.find("b").text().trim();
        let teacherRoom = textDiv.html();
        if (teacherRoom) {
          let parts = teacherRoom.split("<br>");
          if (parts.length > 1) {
            let teacherRoomText = parts[1].replace(/<[^>]*>/g, "").trim();
            teacherRoomText = teacherRoomText.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

            if (teacherRoomText.startsWith("-")) {
              teacherRoomText = teacherRoomText.substring(1).trim();
            }

            let match = teacherRoomText.match(/^(.+?)\s+s\.\s+(.+)$/);
            let teacher = match ? match[1].trim() : teacherRoomText;
            let room = match ? match[2].trim() : "";

            list.push({
              subject: subject,
              teacher: teacher,
              room: room,
              time: hour
            });
          } else {
            list.push({
              subject: subject,
              teacher: "",
              room: "",
              time: hour
            });
          }
        }
      } else {
        list.push(null);
      }
    });
    return { hour: hour, list: list };
  };

  let tableMapper = (html) => {
    if (!html || html.length < 100) {
      return {};
    }

    const $ = cheerio.load(html);
    let table = {};
    let hours = [];

    let rows = $("table.decorated.plan-lekcji tbody tr.line1");
    if (rows.length === 0) {
      rows = $("tr.line1");
    }

    rows.each((index, row) => {
      let parsed = parser($, row);

      if (parsed && parsed.hour) {
        hours.push(parsed.hour);
        parsed.list.forEach((lesson, dayIndex) => {
          if (dayIndex < days.length) {
            let dayKey = days[dayIndex];
            if (!table[dayKey]) {
              table[dayKey] = [];
            }
            if (lesson) {
              table[dayKey].push(lesson);
            }
          }
        });
      }
    });

    Object.keys(table).forEach(dayKey => {
      table[dayKey] = table[dayKey].filter(lesson => lesson !== null);
    });

    return table;
  };

  let formData = new FormData()
  formData.append("tydzien", `${from}_${to}`)

  try {
    // @ts-ignore
    const response = await client._request("post", "przegladaj_plan_lekcji", formData, 'text');

    let htmlContent;
    if (typeof response === 'function' && response.html) {
      htmlContent = response.html();
    } else if (typeof response === 'string') {
      htmlContent = response;
    } else {
      htmlContent = String(response);
    }

    return tableMapper(htmlContent);
  } catch (error) {
    console.error('🔥 Timetable request failed:', error);
    throw error;
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await getAuthenticatedClient(req);
    if (!client) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const timetable = await getTimetable(client as Librus);
    return res.status(200).json(timetable);
  } catch (error: any) {
    console.error('🔥 Timetable API error');
    return res.status(500).json({ message: error.message || "An error occurred." });
  }
}
