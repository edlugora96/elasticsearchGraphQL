const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
  },
]

module.exports = {
  Query: {
    books: () => books,
    users: async (_, __, { dataSources }) => {
      const usersGet = await dataSources.usersAPI.getAllDocuments()
      console.log(usersGet)
      return "YES"
    },
  },
}
