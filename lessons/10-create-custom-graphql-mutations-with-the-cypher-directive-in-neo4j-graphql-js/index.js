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
  species: [Species] @cypher(statement: """
    MATCH (this)<-[:HAS_HOMEWORLD]-(:Person)-[:HAS_SPECIES]->(species:Species)
    RETURN DISTINCT species
  """)
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

type Mutation {
  CreatePerson(name: String!): Person @cypher(statement: """
    MERGE (thing:Person { name: $name })
    RETURN thing
  """)
  CreatePlanet(name: String!): Planet @cypher(statement: """
    MERGE (thing:Planet { name: $name })
    RETURN thing
  """)
  CreateSpecies(name: String!): Species @cypher(statement: """
    MERGE (thing:Species { name: $name })
    RETURN thing
  """)
  CreateFilm(title: String!): Film @cypher(statement: """
    MERGE (thing:Film { title: $title })
    RETURN thing
  """)

  AddPersonHomeworld(from: _PersonInput!, to: _PlanetInput!): Person @cypher(statement: """
    MATCH (thing_from:Person {name: $from.name})
    MATCH (thing_to:Planet {name: $to.name})
    MERGE (thing_from)-[:HAS_HOMEWORLD]->(thing_to)
    RETURN thing_from
  """)
  AddPersonSpecies(from: _PersonInput!, to: _SpeciesInput!): Person @cypher(statement: """
    MATCH (thing_from:Person {name: $from.name})
    MATCH (thing_to:Species {name: $to.name})
    MERGE (thing_from)-[:HAS_SPECIES]->(thing_to)
    RETURN thing_from
  """)
  AddPersonFilms(from: _PersonInput!, to: _FilmInput!): Person @cypher(statement: """
    MATCH (thing_from:Person {name: $from.name})
    MATCH (thing_to:Film {title: $to.title})
    MERGE (thing_from)-[:APPEARED_IN]->(thing_to)
    RETURN thing_from
  """)
  AddPlanetFilms(from: _PlanetInput!, to: _FilmInput!): Planet @cypher(statement: """
    MATCH (thing_from:Planet {name: $from.name})
    MATCH (thing_to:Film {title: $to.title})
    MERGE (thing_from)-[:APPEARED_IN]->(thing_to)
    RETURN thing_from
  """)
  AddSpeciesFilms(from: _SpeciesInput!, to: _FilmInput!): Species @cypher(statement: """
    MATCH (thing_from:Species {name: $from.name})
    MATCH (thing_to:Film {title: $to.title})
    MERGE (thing_from)-[:APPEARED_IN]->(thing_to)
    RETURN thing_from
  """)
}
`

const schema = makeAugmentedSchema({ typeDefs })

new ApolloServer({
  schema,
  context: { driver }
}).listen(8000, '0.0.0.0')
  .then(({ url }) => console.log(`GraphQL API ready at ${url}`))
