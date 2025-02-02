import { MongoClient, ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'

type SectionRequest = {
    _id: ObjectId
    section: {
        current: string
        wants: string[]
    }
    time: string
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
        console.log(body.get('section'))
        filter['section.current'] = {
            $regex: `^${body.get('section')}`,
            $options: 'i',
        }
    }

    try {
        const db = getDatabase()
        const sectionInfoCollection = db.collection('section-info')
        const classInfoCollection = db.collection('class-info')
        const requests = await Promise.all(
            (await db
                .collection('classes')
                .find(filter)
                .sort({ time: 1 })
                .limit(10)
                .toArray())!.map(async (classItem: any) => {
                const sectionInfo = await sectionInfoCollection.findOne({
                    _id: classItem.section.current,
                })
                if (!sectionInfo) return
                const classInfo = await classInfoCollection.findOne({
                    _id: sectionInfo.courseString,
                })
                if (!classInfo) return
                return {
                    _id: classItem._id,
                    email: classItem.email,
                    section: classItem.section,
                    time: classItem.time,
                    courseString: sectionInfo?.courseString,
                    courseName: classInfo?.name,
                }
            })
        )
        return Response.json(requests)
    } catch (e) {
        console.error(e)
    }
}

/// Currently, this function doesn't work very nicely - we don't check if the email
/// is in our database as anyone can create a request and it can cause a lot of problems
/// for us. However, the users that are using the app directly on Web are already
/// authenticated, with Auth0.
export async function POST(request: NextRequest) {
    const body = (await request.json()) as {
        email: string
        time: string
        section: {
            current: string
            wants: string[]
        }
    }
    const db = getDatabase()
    const result = await db.collection('classes').insertOne(body)
    return Response.json(result)
}
