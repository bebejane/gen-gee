type Field = {
  label: string
  value: string
  type: 'text' | 'image' | 'select' | 'textarea' | 'number' | 'color'
  min?: number
  max?: number
  options?: [{
    label: string
    value: string
  }]
}

type Fields = {
  [key: string]: Field
}

type ConfigParameters = {
  templateId: string | undefined,
  buttonLabel: string
};
