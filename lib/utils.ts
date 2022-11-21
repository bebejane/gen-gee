export const Base64 = {
  encode: (obj: any): string => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))),
  decode: (str: string): any => JSON.parse(decodeURIComponent(escape(atob(str))))
}