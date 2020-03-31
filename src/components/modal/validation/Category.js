export function validate (formProps) {
  let errors = {}
  if (!formProps.category) {
    errors.category = 'Please choose a category'
  }
  return errors
}
