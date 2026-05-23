// user 정보나 todo 관련 타입 등은 여기에 작성
export type User = {
  id: string
  name: string
  email: string
}
 export type Goal = {
  id: number,
  title : string,
  deadline : string
 }

 export type GoalGroup = {
  year: number,
  month: number,
  day: number,
  goals : Goal[]
 }