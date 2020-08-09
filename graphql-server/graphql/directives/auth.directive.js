const { SchemaDirectiveVisitor } = require("apollo-server")
const { defaultFieldResolver } = require("graphql")
const { hasRole } = require("../../../utils")

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type)
    type._requiredAuthRole = this.args.requires
  }
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType)
    field._requiredAuthRole = this.args.requires
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) return
    objectType._authFieldsWrapped = true

    const fields = objectType.getFields()

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole =
          field._requiredAuthRole || objectType._requiredAuthRole
        const compareRoles = hasRole(requiredRole)
        if (!requiredRole) {
          return resolve.apply(this, args)
        }
        const context = args[2]

        const userRole = context.currentUser?.role
        if (!compareRoles(userRole)) {
          throw new Error("not authorized")
        }

        return resolve.apply(this, args)
      }
    })
  }
}
module.exports = AuthDirective
