import Rx from 'rxjs/Rx'
const $input = document.querySelector('input')
const keyPresses$ = Rx.Observable.fromEvent($input, 'input')
const displayItems = items => items.reduce((acc, item) =>
  acc += `<li><img width="32" src="${item.avatar_url}" />${item.login}</li>`, '')
const updateDom = result =>
  document.querySelector('#results').innerHTML = `<ol>${displayItems(result.items)}</ol>`

const result$ = keyPresses$
  .debounce(() => Rx.Observable.timer(250))
  .map(key => key.target.value)
  .map(key => {
    return Rx.Observable
      .ajax('https://api.github.com/search/users?q=' + key)
      .retry(3)
      .takeUntil(keyPresses$)
      .map(e => e.response)
  })
  .concatAll()

result$.subscribe(updateDom, console.error)
