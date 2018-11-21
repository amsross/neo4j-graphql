const { v1: neo4j } = require('neo4j-driver')
const { ApolloServer } = require('apollo-server')
const { makeAugmentedSchema } = require('neo4j-graphql-js')
const { readFileSync } = require('fs')

const driver = neo4j.driver(
  `bolt://${process.env.NEO4J_HOST}:7687`,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))

const typeDefs = readFileSync('./typeDefs.graphql', 'utf-8')

const schema = makeAugmentedSchema({ typeDefs })

new ApolloServer({
  schema,
  context: { driver }
}).listen(8000, '0.0.0.0')
  .then(({ url }) => console.log(`GraphQL API ready at ${url}`))
