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

    const chunks: any[] = [];
    const videoStream = ytdl(url, { format: format });

    // Collect video data into chunks
    videoStream.on("data", (chunk) => chunks.push(chunk));
    await new Promise((resolve, reject) => {
      videoStream.on("end", resolve);
      videoStream.on("error", reject);
    });

    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": `video/${format.container}`,
        "Content-Disposition": `attachment; filename="${info.videoDetails.title}.${format.container}"`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { msg: "Error occurred", error },
      { status: 500 }
    );
  }
}
