import Rx from 'rxjs/Rx'
const $dragTarget = document.getElementById('dragTarget')

const mouseup$   = Rx.Observable.fromEvent($dragTarget, 'mouseup')
const mousemove$ = Rx.Observable.fromEvent(document,   'mousemove')
const mousedown$ = Rx.Observable.fromEvent($dragTarget, 'mousedown')

const mousedrag$ = mousedown$.flatMap((md) => {
  const startX = md.offsetX
  const startY = md.offsetY

  return mousemove$.map((mm) => {
    mm.preventDefault()
    return {
      left: mm.clientX - startX,
      top: mm.clientY - startY
    }
  }).takeUntil(mouseup$)
})

const subscription = mousedrag$.subscribe((pos) => {
  dragTarget.style.top = pos.top + 'px'
  dragTarget.style.left = pos.left + 'px'
})