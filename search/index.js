import Rx from 'rxjs/Rx'

const $input = document.querySelector('input')
const $result = document.querySelector('#results')
const keyPresses$ = Rx.Observable.fromEvent($input, 'input')

const makeList = (acc, item) => acc += `
  <li>
    <img width="32" src="${item.avatar_url}" />
    <a href="${item.html_url}">${item.login}</a>
  </li>
`

const displayItems = items => items.reduce(makeList, '')

const updateDom = result =>
  $result.innerHTML = `<ol>${displayItems(result.items)}</ol>`

const result$ = keyPresses$
  .debounce(() => Rx.Observable.timer(250))
  .map(key => key.target.value)
  .map(key => {
    return Rx.Observable
      .ajax('https://api.github.com/search/users?q=' + key)
      .retry(2)
      .takeUntil(keyPresses$)
      .map(e => e.response)
  })
  .concatAll()

result$.subscribe(updateDom, console.error)
