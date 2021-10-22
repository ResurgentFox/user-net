function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function makeUser(index = 0) {
  return {
    name: `userName ${index}`,
    surname: `userSurname ${index}`,
    age: random(18, 100),
    regDate: Date.UTC(random(1970, 2021), random(0, 12), random(0, 31)),
  }
}

export function makeUsers(userCount = 100) {
  const users = []
  for (let i = 0; i < userCount; i++) {
    users.push(makeUser(i))
  }
  return users
}

export function makeFollows(followsCount = 300, ids) {
  const follows = []
  for (let i = 0; i < followsCount; i++) {
    const fromIndex = random(0, ids.length)
    const toIndex = random(0, ids.length - 1)
    const from = ids[fromIndex]
    const to = [...ids.slice(0, fromIndex), ...ids.slice(fromIndex + 1)][
      toIndex
    ]
    follows.push({ from, to })
  }
  return follows
}
