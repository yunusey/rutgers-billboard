import { MongoClient, ObjectId } from 'mongodb'
import { type NextRequest } from 'next/server'

function getDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI!)
    return client.db('rutgers-billboard')
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ infoType: string }> }
) {
    const { infoType } = await params
    const url = new URL(request.url!)
    const searchParams = url.searchParams
    const filter = searchParams
        .entries()
        .map(([key, value]) => ({ [key]: value }))
        .reduce((a, b) => ({ ...a, ...b }), {})
    if (!infoType && infoType !== 'class' && infoType !== 'section') {
        return Response.json([])
    }

    const collection = `${infoType}-info`

    try {
        const db = getDatabase()
        const response = await db.collection(collection).find(filter).toArray()
        return Response.json(response)
    } catch (e) {
        console.error(e)
    }
}
