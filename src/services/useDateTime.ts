export function useDateTime() {
  // Format a date string to human-readable format
  const formatDateTime = (isoString: any) => {
    if (!isoString) return ''

    const date = new Date(isoString)

    // Options for date
    const options = {
      year: 'numeric',
      month: 'short',   // e.g., Oct
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false     // set to true for AM/PM
    }

    return date.toLocaleString('en-US', options)
  }

  return { formatDateTime }
}
