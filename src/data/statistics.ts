export type StatisticId = 'projects' | 'years' | 'awards' | 'countries'

export interface Statistic {
  id: StatisticId
  value: number
}

export const statistics: readonly Statistic[] = [
  { id: 'projects', value: 48 },
  { id: 'years', value: 12 },
  { id: 'awards', value: 9 },
  { id: 'countries', value: 7 },
]