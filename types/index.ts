export type TailorRequest = {
  resume: string
  jobDescription: string
}

export type BulletResult = {
  original: string
  rewritten: string
}

export type refineResult = {
  results: BulletResult[]
  instruction: string
}

export type TailorResponse = {
  results: BulletResult[]
}
