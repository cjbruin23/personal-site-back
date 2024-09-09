import { Generated, Insertable, Selectable, Updateable } from "kysely"

export interface Database {
    stories: StoriesTable
}

export interface StoriesTable {
    name: string
    desc: string
    user_id: string
}

export type Stories = Selectable<StoriesTable>
export type NewStory = Insertable<StoriesTable>
export type StoryUpdate = Updateable<StoriesTable>