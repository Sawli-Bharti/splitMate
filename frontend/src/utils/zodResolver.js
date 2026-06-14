export function zodResolver(schema) {
  return async (values) => {
    const result = schema.safeParse(values)

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      }
    }

    const errors = result.error.issues.reduce((acc, issue) => {
      const field = issue.path.join('.')

      if (!acc[field]) {
        acc[field] = {
          type: issue.code,
          message: issue.message,
        }
      }

      return acc
    }, {})

    return {
      values: {},
      errors,
    }
  }
}
