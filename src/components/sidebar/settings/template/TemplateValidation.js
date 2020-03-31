export function validate (formProps) {
  const errors = {}
  if (!formProps.name) {
    errors.name = 'Please enter name'
  }

  return errors
}
