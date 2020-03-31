export function validate (formProps) {
  let errors = {}
  if (!formProps.key) {
    errors.key = 'Please enter a key'
  }
  if (!formProps.value) {
    errors.value = 'Please enter a value'
  }
  return errors
}
