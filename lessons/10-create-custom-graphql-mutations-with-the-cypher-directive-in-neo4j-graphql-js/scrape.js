const { get } = require('axios')
const { request } = require('graphql-request')

const api = 'http://0.0.0.0:8000'
const swapi = 'https://swapi.co/api'

async function main () {
  const { data: { results: [ person, ...people ] } } = await get(swapi + '/people')
  const { data: homeworld } = await get(person.homeworld)
  const { data: species } = await get(person.species[0])
  const { data: film } = await get(person.films[0])

  const nodeResults = await Promise.all([
    createPerson(person),
    createPlanet(homeworld),
    createSpecies(species),
    createFilm(film),
  ])

  const relationshipResults = await Promise.all([
    addPersonHomeworld(person, homeworld),
    addPersonSpecies(person, species),
    addPersonFilms(person, film),
    addPlanetFilms(homeworld, film),
    addSpeciesFilms(species, film),
  ])

  return [ nodeResults, relationshipResults ]
}

const addPersonHomeworld = (person, planet) => request(api, `mutation addPersonHomeworld($from: _PersonInput!, $to: _PlanetInput!) {
  AddPersonHomeworld(from: $from, to: $to) { from { name } to { name } }
}`, { from: { name: person.name }, to: { name: planet.name } })

const addPersonSpecies = (person, species) => request(api, `mutation addPersonSpecies($from: _PersonInput!, $to: _SpeciesInput!) {
  AddPersonSpecies(from: $from, to: $to) { from { name } to { name } }
}`, { from: { name: person.name }, to: { name: species.name } })

const addPersonFilms = (person, film) => request(api, `mutation addPersonFilms($from: _PersonInput!, $to: _FilmInput!) {
  AddPersonFilms(from: $from, to: $to) { from { name } to { title } }
}`, { from: { name: person.name }, to: { title: film.title } })

const addPlanetFilms = (planet, film) => request(api, `mutation addPlanetFilms($from: _PlanetInput!, $to: _FilmInput!) {
  AddPlanetFilms(from: $from, to: $to) { from { name } to { title } }
}`, { from: { name: planet.name }, to: { title: film.title } })

const addSpeciesFilms = (species, film) => request(api, `mutation addSpeciesFilms($from: _SpeciesInput!, $to: _FilmInput!) {
  AddSpeciesFilms(from: $from, to: $to) { from { name } to { title } }
}`, { from: { name: species.name }, to: { title: film.title } })

const createPerson = ({ name }) => request(api, `mutation createPerson($name: String!) {
  CreatePerson(name: $name) { name }
}`, { name })

const createPlanet = ({ name }) => request(api, `mutation createPlanet($name: String!) {
  CreatePlanet(name: $name) { name }
}`, { name })

const createSpecies = ({ name }) => request(api, `mutation createSpecies($name: String!) {
  CreateSpecies(name: $name) { name }
}`, { name })

const createFilm = ({ title }) => request(api, `mutation createFilm($title: String!) {
  CreateFilm(title: $title) { title }
}`, { title })

main()
  .then(console.log)
  .catch(console.error)
