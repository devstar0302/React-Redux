export function validate (formProps) {
  let errors = {}
  if (!formProps.email) {
    errors.email = 'Email can\'t be blank.'
  }
  if (!formProps.license) {
    errors.license = 'License can\'t be blank.'
  }
  return errors
}
