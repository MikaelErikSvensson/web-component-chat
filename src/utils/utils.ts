export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export const dateISOLocalTime = (d: Date) => {
  if (d !== undefined) {
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString();
    return date + 'T' + time;
  } else {
    const nd = new Date();
    const date = nd.toLocaleDateString();
    const time = nd.toLocaleTimeString();
    return date + 'T' + time;
  }
};

export const getTimeFromISOString = (d: string) => {
  const splitDateTime = d.split('T');
  const time = splitDateTime[1].split(':');
  return time[0] + ':' + time[1];
};
