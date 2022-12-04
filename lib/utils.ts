import validateColor from "validate-color";

export const Base64 = {
  encode: (obj: any): string => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))),
  decode: (str: string): any => JSON.parse(decodeURIComponent(escape(atob(str))))
}

export const isValidFieldValue = (field: Field, value: any): boolean => {
  if (!field || value === undefined)
    return false
  if (field.type === 'number' && (field.min !== undefined && parseInt(value) < field.min) || (field.max !== undefined && parseInt(value) > field.max))
    return false
  if ((field.type === 'text' || field.type === 'textarea') && (field.min !== undefined && value.length < field.min) || (field.max !== undefined && value.length > field.max))
    return false
  //if (field.type === 'color' && !validateColor(value)) return false
  return true;
}