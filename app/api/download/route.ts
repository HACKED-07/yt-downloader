import { createWriteStream } from "fs"
import ytdl from "@distube/ytdl-core"

export async function POST(request: Request) {
    const data = await request.json()
    const url = data.body.url
    const info = await ytdl.getInfo(url)
    info.formats.forEach((item) => console.log(item.itag, ": ", item.qualityLabel, " : ", item.hasAudio, " : ", item.hasVideo))
    const format = ytdl.chooseFormat(info.formats, { quality: "18" })
    const stream = ytdl(url, {format: format}).pipe(createWriteStream(`./Videos/${info.videoDetails.title}.${format.container}`))
    console.log(data)
    return Response.json({ msg: "Completed" })
    
}