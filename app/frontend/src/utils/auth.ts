import { Form } from '../../../shared/form'

export const validateForm = (form: Form) => {
  return (
    form.username.length >= 1 &&
    form.username.length <= 16 &&
    form.email.includes('@') &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword
  )
}
