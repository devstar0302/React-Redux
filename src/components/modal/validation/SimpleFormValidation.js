export function validate (formProps) {
  let errors = {}
  console.log('validating')
  if (!formProps.name) {
    errors.name = 'Please enter a text'
  }
  return errors
}
