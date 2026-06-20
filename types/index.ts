export type TailorRequest = {
  resume: string
  jobDescription: string
}

export type BulletResult = {
  original: string
  rewritten: string
}

export type TailorResponse = {
  bullets: BulletResult[]
}