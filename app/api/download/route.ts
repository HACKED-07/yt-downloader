import ytdl from "@distube/ytdl-core";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const url = data.body.url;

    if (!ytdl.validateURL(url)) {
      return Response.json({ msg: "Invalid YouTube URL" }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "18" });
    const videoStream = ytdl(url, { format: format });
    const stream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => controller.enqueue(chunk));
        videoStream.on("end", () => controller.close());
        videoStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": `video/${format.container}`,
        "Content-Disposition": "attachment",
        "X-Video-Title": encodeURIComponent(info.videoDetails.title)
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { msg: "Error occurred" },
      { status: 500 }
    );
  }
}
