import { makeUsers, makeFollows } from './helper.js'

export async function seedDatabase(client) {
  const usersCollection = client.db().collection('users')
  const followsCollection = client.db().collection('follows')
  console.log('Seeding db data...')

  const usersCount = await usersCollection.countDocuments()
  const followsCount = await followsCollection.countDocuments()
  if (usersCount != 0) {
    usersCollection.drop()
  }
  if (followsCount != 0) {
    followsCollection.drop()
  }

  const users = makeUsers()
  const result = await usersCollection.insertMany(users)
  const ids = Object.values(result.insertedIds)

  const follows = makeFollows(300, ids)
  followsCollection.insertMany(follows)
}
