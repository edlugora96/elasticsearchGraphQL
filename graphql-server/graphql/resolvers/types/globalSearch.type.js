module.exports = {
  __resolveType: entity => {
    if (entity.birthday) {
      return "User"
    }
    if (entity.active) {
      return "Gadget"
    }
    return "Project"
  },
}
