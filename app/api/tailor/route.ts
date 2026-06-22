import {TailorRequest} from '@/types'
import {tailorResume} from '@/lib/groq'


export async function POST(request: Request) {
    const body: TailorRequest = await request.json()
    const result = await tailorResume(body.resume, body.jobDescription)
    return Response.json(result)
}
