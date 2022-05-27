import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function formatRelativeTime(input: Date | number | string) {
  return dayjs(input).fromNow()
}
