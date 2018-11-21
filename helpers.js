const h = require('highland')
const { request } = require('graphql-request')

const local = 'http://localhost:8000'

const mergeFilm = ({ characters, planets, starships, vehicles, species, url, ...film }) => {
  const mutation = `mutation mergeFilm($params: _FilmInput!) {
    result: MergeFilm(input: $params) { title }
  }`

  return mutate(mutation)({ params: film })
}

const mergePerson = ({ homeworld, films, species, vehicles, starships, url, ...person }) => {
  const mutation = `mutation mergePerson($params: _PersonInput!) {
    result: MergePerson(input: $params) { name }
  }`

  return mutate(mutation)({ params: person })
}

const mergePlanet = ({ residents, films, url, ...planet }) => {
  const mutation = `mutation mergePlanet($params: _PlanetInput!) {
    result: MergePlanet(input: $params) { name }
  }`

  return mutate(mutation)({ params: planet })
}

const mergeSpecies = ({ homeworld, people, films, url, ...species }) => {
  const mutation = `mutation mergeSpecies($params: _SpeciesInput!) {
    result: MergeSpecies(input: $params) { name }
  }`

  return mutate(mutation)({ params: species })
}

const mergeFilmPerson = ({ characters, planets, starships, vehicles, species, url, ...film }) => {
  const mutation = `mutation mergeFilmPerson($film: _FilmInput!, $person: _PersonInput!) {
  result: MergeFilmPerson(from: $person, to: $film) { from { name } to { title }  }
}`

  return ({ homeworld, films, species, vehicles, starships, url, ...person }) => mutate(mutation)({ person, film })
}

const mergeFilmPlanet = ({ characters, planets, starships, vehicles, species, url, ...film }) => {
  const mutation = `mutation mergeFilmPlanet($film: _FilmInput!, $planet: _PlanetInput!) {
  result: MergeFilmPlanet(from: $planet, to: $film) { from { name } to { title }  }
}`

  return ({ residents, films, url, ...planet }) => mutate(mutation)({ planet, film })
}

const mergeFilmSpecies = ({ characters, planets, starships, vehicles, species, url, ...film }) => {
  const mutation = `mutation mergeFilmSpecies($film: _FilmInput!, $species: _SpeciesInput!) {
  result: MergeFilmSpecies(from: $species, to: $film) { from { name } to { title }  }
}`

  return ({ homeworld, people, films, url, ...species }) => mutate(mutation)({ species, film })
}

const mergePersonPlanet = ({ homeworld, films, species, vehicles, starships, url, ...person }) => {
  const mutation = `mutation mergePersonPlanet($person: _PersonInput!, $planet: _PlanetInput!) {
  result: MergePersonPlanet(from: $person, to: $planet) { from { name } to { name } }
}`

  return ({ residents, films, url, ...planet }) => mutate(mutation)({ planet, person })
}

const mergePersonSpecies = ({ homeworld, films, species, vehicles, starships, url, ...person }) => {
  const mutation = `mutation mergePersonSpecies($person: _PersonInput!, $species: _SpeciesInput!) {
  result: MergePersonSpecies(from: $person, to: $species) { from { name } to { name } }
}`

  return ({ homeworld, people, films, url, ...species }) => mutate(mutation)({ species, person })
}

const mutate = mutation => params => h(request(local, mutation, params))
  .errors(({ response: { errors } }, push) => errors.forEach(push))

module.exports = {
  mergeFilm,
  mergePerson,
  mergePlanet,
  mergeSpecies,
  mergeFilmPerson,
  mergeFilmPlanet,
  mergeFilmSpecies,
  mergePersonPlanet,
  mergePersonSpecies,
}
