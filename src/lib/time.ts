import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type DateInput = Date | number | string

export function humanReadableTime(input: DateInput) {
  return dayjs(input).format('MMMM D, YYYY h:mm A')
}

export function formatRelativeTime(input: DateInput) {
  return dayjs(input).fromNow()
}
