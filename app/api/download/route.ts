import { NextRequest, NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const url = data.body.url;

    if (!ytdl.validateURL(url)) {
      console.error("Invalid YouTube URL:", url);
      return NextResponse.json({ msg: "Invalid YouTube URL" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "18" });

    // Create a Readable stream
    const videoStream = ytdl(url, { format: format });

    // Create a readable stream and a custom Response
    const stream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        videoStream.on("end", () => {
          controller.close();
        });
        videoStream.on("error", (err) => {
          console.error("Stream error:", err);
          controller.error(err);
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": `video/${format.container}`,
        "Content-Disposition": `attachment; filename="${info.videoDetails.title}.${format.container}"`,
      },
    });
  } catch (error) {
    console.error("Error occurred during video download:", error);
    return NextResponse.json(
      { msg: "Error occurred" },
      { status: 500 }
    );
  }
}
