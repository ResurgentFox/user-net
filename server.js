import * as dotenv from 'dotenv'
import express from 'express'
import { MongoClient } from 'mongodb'
import { seedDatabase } from './database.js'

dotenv.config()

const uri = process.env.DB_CONNECTION_STRING
const client = new MongoClient(uri)
const port = process.env.PORT
const host = process.env.HOST

const app = express()

app.get('/friendscount', async (req, res) => {
  let friendsCount = 0
  const followsCollection = client.db().collection('follows')
  const follows = await followsCollection.find().toArray()

  await Promise.all(
    follows.map(async (user) => {
      const followers = followsCollection.find({ to: user.from })
      const friends = await followers.filter({ from: user.to }).toArray()
      friendsCount += friends.length
    })
  )

  res.json({ friendsCount })
})

app.get('/popular', async (req, res) => {
  const usersCollection = client.db().collection('users')
  const cursor = usersCollection.aggregate([
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'to',
        as: 'followers',
      },
    },
    {
      $addFields: {
        followersCount: { $size: '$followers' },
      },
    },
    {
      $sort: {
        followersCount: -1,
      },
    },
    {
      $unset: 'followers',
    },
  ])
  const popular = await cursor.limit(3).toArray()
  res.send(popular)
})

app.get('*', (req, res) => {
  res.status(404)
  res.send('Page not found :{')
})

client.connect(async () => {
  await seedDatabase(client)
  app.listen(port, host)
  console.log(`Server is running on http://${host}:${port}`)
})
