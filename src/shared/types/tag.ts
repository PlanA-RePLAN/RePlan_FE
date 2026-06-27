export interface Tag {
  tagId: number
  title: string
  color: string | null
}

export type CreateTagRequest = {
  title: string
  color?: string | null
}

export type CreateTagData = Tag
