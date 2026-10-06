import { component$ } from 'nanoviews'
import {
  navigation,
  paths
} from '#src/stores/router'

const Home = component$(() => {
  navigation.replace(paths.characters)

  return null
})

export default Home
