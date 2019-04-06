/*
 * Vector math functions
 */

const VMath = {}
VMath.dot = (a, b) => a.x * b.x + a.y * b.y
VMath.magnitude = (a) => Math.sqrt(a.x * a.x + a.y * a.y)
VMath.normalize = (a) => {
  const mag = VMath.magnitude(a)

  if (mag === 0) {
    return {
      x: 0,
      y: 0,
    }
  } else {
    return {
      x: a.x / mag,
      y: a.y / mag,
    }
  }
}
VMath.add = (a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}
VMath.sub = (a, b) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
}
VMath.mult = (a, b) => {
  return {
    x: a.x * b.x,
    y: a.y * b.y,
  }
}

VMath.distance = (a, b) => {
  const x = a.x - b.x
  const y = a.y - b.y
  return { x, y }
}
VMath.angle = (a, b) => {
  const ax = a.x - b.x
  const ay = a.y - b.y
  return Math.atan2(ay, ax)
}
VMath.angleBetween = (a, b) => {
  return Math.acos(VMath.dot(a, b) / (VMath.magnitude(a) * VMath.magnitude(b)))
}
VMath.rotate = (a, angle) => {
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  const rx = a.x * ca - a.y * sa
  const ry = a.x * sa + a.y * ca
  return {
    x: rx * -1,
    y: ry * -1,
  }
}
VMath.invert = (a) => {
  return {
    x: a.x * -1,
    y: a.y * -1,
  }
}

/*
 * VMath cross product function has been simplified by
 * setting x and y to zero because vectors a and b
 * lie in the canvas plane
 */
VMath.cross = (a, b) => {
  return {
    x: 0,
    y: 0,
    z: a.x * b.y - b.x * a.y,
  }
}

export default VMath
