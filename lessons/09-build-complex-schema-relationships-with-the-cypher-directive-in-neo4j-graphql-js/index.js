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
    RETURN DITSINCT species
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
    MERGE (person:Person { name: $name })
    RETURN person
  """)
  CreatePlanet(name: String!): Planet @cypher(statement: """
    MERGE (planet:Planet { name: $name })
    RETURN planet
  """)
  CreateSpecies(name: String!): Species @cypher(statement: """
    MERGE (species:Species { name: $name })
    RETURN species
  """)
  CreateFilm(title: String!): Film @cypher(statement: """
    MERGE (film:Film { title: $title })
    RETURN film
  """)

  AddPersonHomeworld(from: _PersonInput!, to: _PlanetInput!): Person @cypher(statement: """
    MATCH (person_from:Person {name: $from.name})
    MATCH (planet_to:Planet {name: $to.name})
    MERGE (person_from)-[:HAS_HOMEWORLD]->(planet_to)
    RETURN person_from
  """)
  AddPersonSpecies(from: _PersonInput!, to: _SpeciesInput!): Person @cypher(statement: """
    MATCH (person_from:Person {name: $from.name})
    MATCH (species_to:Species {name: $to.name})
    MERGE (person_from)-[:HAS_SPECIES]->(species_to)
    RETURN person_from
  """)
  AddPersonFilms(from: _PersonInput!, to: _FilmInput!): Person @cypher(statement: """
    MATCH (person_from:Person {name: $from.name})
    MATCH (film_to:Film {title: $to.title})
    MERGE (person_from)-[:APPEARED_IN]->(film_to)
    RETURN person_from
  """)
  AddPlanetFilms(from: _PlanetInput!, to: _FilmInput!): Planet @cypher(statement: """
    MATCH (planet_from:Planet {name: $from.name})
    MATCH (film_to:Film {title: $to.title})
    MERGE (planet_from)-[:APPEARED_IN]->(film_to)
    RETURN planet_from
  """)
  AddSpeciesFilms(from: _SpeciesInput!, to: _FilmInput!): Species @cypher(statement: """
    MATCH (species_from:Species {name: $from.name})
    MATCH (film_to:Film {title: $to.title})
    MERGE (species_from)-[:APPEARED_IN]->(film_to)
    RETURN species_from
  """)
}
`

const schema = makeAugmentedSchema({ typeDefs })

new ApolloServer({
  schema,
  context: { driver }
}).listen(8000, '0.0.0.0')
  .then(({ url }) => console.log(`GraphQL API ready at ${url}`))
