export const getMousePos = (e, el) => {
  if (e.targetTouches && e.targetTouches[0]) {
    e = e.targetTouches[0]
  }

  const rect = el.getBoundingClientRect()

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}
