export function validate (formProps) {
  let errors = {}
  if (!formProps.name) {
    errors.name = 'Please enter a text'
  }
  return errors
}
