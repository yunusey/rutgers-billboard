import { MongoClient, ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

type SectionRequest = {
    _id: ObjectId
    class: String
    section: {
        current: String
        wants: String
    }
    time: String
}

function getDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI!)
    return client.db('rutgers-billboard')
}

export async function GET(request: Request) {
    const url = new URL(request.url)
    const body = url.searchParams
    let filter: any = {}
    if (body.get('class')) {
        filter['class'] = body.get('class')
    }
    if (body.get('section')) {
        filter['section.current'] = body.get('section')
    }
    //console.log(filter)

    try {
        const db = getDatabase()
        const classes: SectionRequest[] = (await db
            .collection('classes')
            .find(filter)
            .sort({ time: 1 })
            .limit(10)
            .toArray())!.map((classItem) => {
            return {
                _id: classItem._id,
                class: classItem.class,
                section: classItem.section,
                time: classItem.time,
            }
        })
        return Response.json(classes)
    } catch (e) {
        console.error(e)
    }
}

export async function POST(request: Request) {
    const body = (await request.json()) as {
        class: String
        section: {
            current: String
            wants: String
        }
    }
    const db = getDatabase()
    const result = await db.collection('classes').insertOne({
        class: body.class,
        section: body.section,
        time: Date.now(),
    })
    return Response.json(result)
}
