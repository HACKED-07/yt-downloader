import { createWriteStream } from "fs"
import ytdl from "@distube/ytdl-core"

export async function POST(request: Request) {
    const data = await request.json()
    const url = data.body.url
    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, { quality: "18" })
    const stream = ytdl(url, {format: format}).pipe(createWriteStream("video.mp4"))
    console.log(data)
    return Response.json({ msg: "Completed" })
    
}