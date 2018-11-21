const h = require('highland')
const { get } = require('axios')
const helpers = require('./helpers')
const { mergeFilm, mergePerson, mergePlanet, mergeSpecies } = helpers
const { mergeFilmPerson, mergeFilmPlanet, mergeFilmSpecies } = helpers
const { mergePersonPlanet, mergePersonSpecies } = helpers

const base = 'https://swapi.co/api'
const cache = new Map()

const fetch = url => {
  return (cache.has(url) ? h.of(cache.get(url)) : h(get(url)))
    .tap(x => cache.set(url, x))
    .flatMap(({ data }) => h([
      h((data && data.results) ? data.results : [ data ]),
      (data && data.next) ? fetch(data.next) : h([]),
    ]).sequence())
}

const createAndRelate = (mergeNode, mergeRelationship) => url => fetch(url)
  .flatMap(node => mergeNode(node)
    .flatMap(() => mergeRelationship(node)))

const getFilms = fetch(base + '/films')
  .flatMap(film => mergeFilm(film)
    .flatMap(result => h([
      h.of(result),
      h(film.species).flatMap(createAndRelate(mergeSpecies, mergeFilmSpecies(film))),
      h(film.planets).flatMap(createAndRelate(mergePlanet, mergeFilmPlanet(film))),
      h(film.characters).flatMap(createAndRelate(mergePerson, mergeFilmPerson(film))),
    ]).sequence()))

const getPeople = fetch(base + '/people')
  .flatMap(person => mergePerson(person)
    .flatMap(result => h([
      h.of(result),
      h.of(person.homeworld).flatMap(createAndRelate(mergePlanet, mergePersonPlanet(person))),
      h(person.species).flatMap(createAndRelate(mergeSpecies, mergePersonSpecies(person))),
    ]).sequence()))

h([ getFilms, getPeople ])
  .merge()
  .errors(err => console.error(err))
  .each(({ result }) => console.log(result))
