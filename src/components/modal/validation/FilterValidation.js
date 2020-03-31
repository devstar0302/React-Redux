export function validate (formProps) {
  let errors = {}
  if (!formProps.filter) {
    errors.filter = 'Please enter a text'
  }
  return errors
}
