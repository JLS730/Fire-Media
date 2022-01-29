import React, { useEffect, useState } from 'react';

import { auth } from '../scripts/firebase';

import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import '../styles/homepage.css'

const Homepage = () => {
  const navigate = useNavigate()

  const [popularMovie, setPopularMovie] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topMovies, setTopMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])

  useEffect(() => {
    handleMovieDatabaseFetch()
  }, [])

  function handleSignOut() {
    auth.signOut()

    navigate('/')
  }

  function handleMovieDatabaseFetch() {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_MOVIE_DATABASE_API_KEY}&language=en-US&page=1`).then((response) => {
      return response.json()
    }).then((data) => {
      setPopularMovie(data.results[0])

      for (let i = 1; i < 9; i++) {
        setPopularMovies((previousArray) => [...previousArray, data.results[i]])
      }
    })

    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_MOVIE_DATABASE_API_KEY}&language=en-US&page=1`).then((response) => {
      return response.json()
    }).then((data) => {
      for (let i = 1; i < 9; i++) {
        setTopMovies((previousArray) => [...previousArray, data.results[i]])
      }
    })

    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_MOVIE_DATABASE_API_KEY}&language=en-US&page=1`).then((response) => {
      return response.json()
    }).then((data) => {
      for (let i = 1; i < 9; i++) {
        setUpcomingMovies((previousArray) => [...previousArray, data.results[i]])
      }
    })
  }

  function handleMovieid(e, index) {
    // console.log(e.target.parentElement.getAttribute('key'))
    console.log(popularMovies[index])
  }

  return (
    <React.Fragment>
      <nav className="navigation-bar">
        <div className="navigation-bar-left">
          <ul className="navigation-links">
            <li onClick={() => navigate('/homepage')}>Home</li>
          </ul>
        </div>
        <div className="navigation-bar-right">
          <div className="current-user-container">
            <i className="fas fa-user"></i>
            <span className="current-user-username">{auth.currentUser === null ? '' : auth.currentUser.displayName}</span>
          </div>
          <ul className="navigation-links">
            <li onClick={() => navigate('/watch-later')}>Wacth Later</li>
            <li onClick={() => handleSignOut()}>Sign Out</li>
          </ul>
        </div>
      </nav>

      <section className="popular-movie-section">
        <img src={'https://image.tmdb.org/t/p/original' + popularMovie.backdrop_path} alt="" className="popular-movie-image" />
        <div className="popular-movie-background-tint"></div>
        <div className="movie-info-container">
          <span className="popular-movie-title">{popularMovie.title}</span>
          <p className="popular-movie-info">{popularMovie.overview}</p>
          <div className="movie-info-rating-and-date-container">
            <div className="movie-info-rating-container">
              <span>Rating: {popularMovie.vot_average}<span className="movie-info-rating"></span></span>
            </div>
            <div className="movie-info-release-date-container">
              <span>Release Date: {popularMovie.release_date}<span className="movie-info-date"></span></span>
            </div>
          </div>
          <div className="movie-info-button-container">
            <button>More Info</button>
            <button><i className="fas fa-plus"></i> Add to Watch List</button>
          </div>
        </div>
      </section>

      <section className="movies-section">
        <span className="section-titles">Popular Movies</span>
        <div className="popular-movies-container">
          {!popularMovies.length === 8 ? null : popularMovies.map((movies, i) => {
            return (
              <div className={`popular-movies-containers popular-movies-container-` + i + 1} key={movies.id}>
                <Link to={`/current-movie/${movies.id}`}>
                  <img src={`https://image.tmdb.org/t/p/original` + movies.poster_path} alt="" className={`popular-movies-image popular-movies-image-` + i + 1} onClick={(e) => handleMovieid(e, i)} />
                </Link>
                <span className={`popular-movies-titles popular-movies-title-` + i + 1}>{movies.title}</span>
                <div className="popular-movies-rating-container">
                  <i className="fas fa-star"></i>
                  <span className={'popular-movie-rating-' + i + 1}>{movies.vote_average}</span>
                </div>
              </div>
            )
          })}
        </div>
        <span className="section-titles">Top-Rated Movies</span>
        <div className="top-rated-movies-container">
          {!topMovies.length === 8 ? null : topMovies.map((movies, i) => {
            return (
              <div className={`top-rated-movies-containers top-rated-movies-container-` + i + 1} key={i}>
                <Link to={`/current-movie/${movies.id}`}>
                  <img src={`https://image.tmdb.org/t/p/original` + movies.poster_path} alt="" className={`top-rated-movies-image top-rated-movies-image-` + i + 1} />
                </Link>
                <span className={`top-rated-movies-title top-rated-movies-title-` + i + 1}>{movies.title}</span>
                <div className="top-rated-movies-rating-container">
                  <i className="fas fa-star"></i>
                  <span className={'top-rated-movie-rating-' + i + 1}>{movies.vote_average}</span>
                </div>
              </div>
            )
          })}
        </div>
        <span className="section-titles">Upcoming Movies</span>
        <div className="upcoming-movies-container">
          {!upcomingMovies.length === 8 ? null : upcomingMovies.map((movies, i) => {
            return (
              <div className={`upcoming-movies-containers upcoming-movies-container-` + i + 1} key={i}>
                <Link to={`/current-movie/${movies.id}`}>
                  <img src={`https://image.tmdb.org/t/p/original` + movies.poster_path} alt="" className={`upcoming-movies-image upcoming-movies-image-` + i + 1} />
                </Link>
                <span className={`upcoming-movies-title upcoming-movies-title-` + i + 1}>{movies.title}</span>
                <div className="upcoming-movies-rating-container">
                  <i className="fas fa-star"></i>
                  <span className={'upcoming-movie-rating-' + i + 1}>{movies.vote_average}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </React.Fragment>
  )
};

export default Homepage;