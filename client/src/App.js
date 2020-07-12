import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs'

// const items = [
//   {
//     title: "Avatar",
//     release_date: "2009-12-10",
//     director: "Gore Verbinski",
//   },
//   {
//     title: "Adventure Fantasy Action",
//     release_date: "2007-05-19",
//     director: "James Cameron",
//   },
//   {
//     title: "Avatar",
//     release_date: "2009-12-10",
//     director: "Gore Verbinski",
//   },
//   {
//     title: "Adventure Fantasy Action",
//     release_date: "2007-05-19",
//     director: "James Cameron",
//   },
// ]

// const recommended = [
//   {
//     title: "Avatar",
//     release_date: "2009-12-10",
//     director: "Gore Verbinski",
//   },
//   {
//     title: "Adventure Fantasy Action",
//     release_date: "2007-05-19",
//     director: "James Cameron",
//   },
// ]

const App = () => {
  const [items, setitems] = useState([])
  const [recommended, setrecommended] = useState([])
  const [favorites, setfavorites] = useState([])
  useEffect(async () => {
    const response = await fetch('http://localhost:5000/items', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    const data = await response.json()
    if (data.success && data.success === true) {
      setitems(data.movies)
    }
    if (localStorage.getItem("favorites") === null) {
      localStorage.setItem("favorites", [])
      setfavorites([])
    } else {
      const favorites = localStorage.getItem("favorites").split(",")
      setfavorites(favorites)
      const response = await fetch('http://localhost:5000/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      const data = await response.json()
      if (data.success && data.success === true) {
        console.log(data)
        // setitems(data.movies)
      }
    }
  }, [])

  const handleFavorite = (item) => {
    console.log(favorites.includes(item))
    const newFavorites = favorites.includes(item) ? favorites.filter(favorite => favorite !== item) : [...favorites, item]
    console.log(item, newFavorites)
    localStorage.setItem("favorites", newFavorites)
    setfavorites(newFavorites)
  }
  return (
    <div>
      <header>
        <h1>Recommendation Engine</h1>
      </header>
      <div>
        <h2>Recommended</h2>
        {recommended.map(item => (
          <MovieCard item={item} onFavorite={handleFavorite} isFavorite={favorites.includes(item.title)}/>
          ))}
      </div>
      <div>
        <h2>Movies</h2>
        {items.map(item => (
          <MovieCard item={item} onFavorite={handleFavorite} isFavorite={favorites.includes(item.title)}/>
        ))}
      </div>
    </div>
  );
}

const MovieCard = ({item, onFavorite, isFavorite}) => {
  const {title, release_date, director} = item
  return (
    <div>
      <h2>{title} <span style={{fontSize: '0.7em'}}>({dayjs(release_date).format('YYYY')})</span></h2>
      <h3>{director}</h3>
      {onFavorite && (
        <button onClick={() => onFavorite(title)}>{isFavorite ? '💔 Remove from favorites' : '❤️ Favorite'}</button>
      )}
    </div>
  )
}

export default App;
