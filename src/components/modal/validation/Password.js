export function validate (formProps) {
  let errors = {}
  if (!formProps.password) {
    errors.password = 'Please enter a password'
  }
  if (formProps.password !== formProps.confirm) {
    errors.confirm = 'Passwords do not match'
  }
  return errors
}
