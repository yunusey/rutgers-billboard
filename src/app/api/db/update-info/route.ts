/// NOTE: This route will not be permanent - it will be replaced with a cron job
/// In the development stage, we just want to update the database manually. So,
/// please do not mind the bad design here :)

import { MongoClient, ObjectId } from 'mongodb'

/// Of course, 2025, Spring term, and New Brunswick are hardcoded and will be
/// changed dynamically in the future.
const CLASS_INFO_URL =
    'https://sis.rutgers.edu/soc/api/courses.json?year=2025&term=1&campus=NB'

function getDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI!)
    return client.db('rutgers-billboard')
}

type ClassInfo = {
    _id: string
    name: string
}

type SectionInfo = {
    _id: string
    courseString: string
    instructors: string[]
}

async function getSectionData(
    rawData: {
        courseString: string
        sections: { index: string; instructors: { name: string }[] }[]
    }[]
): Promise<SectionInfo[]> {
    let filtered = rawData.map(
        (item: {
            courseString: string
            sections: { index: string; instructors: { name: string }[] }[]
        }) => {
            return item.sections.map(
                (section: {
                    index: string
                    instructors: { name: string }[]
                }) => {
                    return {
                        _id: section.index.trim(),
                        courseString: item.courseString.trim(),
                        instructors: section.instructors.map(
                            (instructor: { name: string }) => {
                                return instructor.name.trim()
                            }
                        ),
                    }
                }
            )
        }
    )

    return filtered.flat()
}

async function getClassData(
    rawData: { courseString: string; expandedTitle: string; title: string }[]
): Promise<ClassInfo[]> {
    const filtered = rawData.map(
        (item: {
            courseString: string
            expandedTitle: string
            title: string
        }) => {
            console.log(item.expandedTitle)
            return {
                _id: item.courseString.trim(),
                // `expandedTitle` property is not always valid
                name: item.expandedTitle.trim() || item.title.trim(),
            }
        }
    )
    return filtered
}

export async function GET(request: Request) {
    const url = new URL(request.url)
    const body = url.searchParams
    const collection = body.get('collection')
    if (collection !== 'class' && collection !== 'section') {
        return Response.json({
            error: 'Invalid collection',
        })
    }

    try {
        const rawData = await (await fetch(CLASS_INFO_URL)).json()
        const db = getDatabase()
        const collectionName =
            collection === 'class' ? 'class-info' : 'section-info'
        const data =
            collection === 'class'
                ? await getClassData(rawData)
                : await getSectionData(rawData)

        // FIXME: This is a hack
        // @ts-ignore
        const result = await db.collection(collectionName).insertMany(data, {})
        return Response.json(result)
    } catch (e) {
        return Response.json(e)
    }
}
