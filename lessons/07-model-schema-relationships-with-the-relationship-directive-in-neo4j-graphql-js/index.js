const { v1: neo4j } = require('neo4j-driver')
const { ApolloServer } = require('apollo-server')
const { makeAugmentedSchema } = require('neo4j-graphql-js')

const driver = neo4j.driver(
  `bolt://${process.env.NEO4J_HOST}:7687`,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))

const typeDefs = `
type Person {
  name: String!
  homeworld: Planet @relation(name: "HAS_HOMEWORLD", direction: "OUT")
  species: [Species] @relation(name: "HAS_SPECIES", direction: "OUT")
  films: [Film] @relation(name: "APPEARED_IN", direction: "OUT")
}
type Planet {
  name: String!
  films: [Film] @relation(name: "APPEARED_IN", direction: "OUT")
}
type Species {
  name: String!
  films: [Film] @relation(name: "APPEARED_IN", direction: "OUT")
}
type Film {
  title: String!
  people: [Person] @relation(name: "APPEARED_IN", direction: "IN")
  planets: [Planet] @relation(name: "APPEARED_IN", direction: "IN")
  species: [Species] @relation(name: "APPEARED_IN", direction: "IN")
}
`

const schema = makeAugmentedSchema({ typeDefs })

new ApolloServer({
  schema,
  context: { driver }
}).listen(8000, '0.0.0.0')
  .then(({ url }) => console.log(`GraphQL API ready at ${url}`))
