import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { auth } from '../scripts/firebase';
import { database } from '../scripts/firebase';
import { ref, set } from "firebase/database";
// import 'dotenv/config'

import noCastImage from '../images/no-image/no-image.jpg'

import '../styles/current-movie.css'

const CurrentMovie = () => {
    const navigate = useNavigate()
    const currentMovieId = useParams().id

    const [currentMovie, setCurrentMovie] = useState([])
    const [currentVideoKey, setCurrentVideoKey] = useState([])
    const [currentMovieStarCount, setCurrentMovieStarCount] = useState([])
    const [currentMovieCredits, setCurrentMovieCredits] = useState([])

    useEffect(() => {
        window.scrollTo(0, 0)

        currentMovieFetch()
    }, [])

    function handleSignOut() {
        auth.signOut()
    
        navigate('/')
    }

    function currentMovieFetch() {
        fetch(`https://api.themoviedb.org/3/movie/${currentMovieId}?api_key=${process.env.REACT_APP_MOVIE_DATABASE_API_KEY}&language=en-US`).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            setCurrentMovie(data)

            for(let i = 0; i < Math.floor(data.vote_average); i++) {
                setCurrentMovieStarCount((previousNumber) => [...previousNumber, i])
            }
        })

        fetch(`https://api.themoviedb.org/3/movie/${currentMovieId}/videos?api_key=${process.env.REACT_APP_MOVIE_DATABASE_API_KEY}&language=en-US`).then((response) => {
            return response.json()
        }).then((data) => {
            setCurrentVideoKey(data.results[0].key)
        })

        fetch(`https://api.themoviedb.org/3/movie/${currentMovieId}/credits?api_key=${process.env.REACT_APP_MOVIE_DATABASE_API_KEY}&language=en-US`).then((response) => {
            return response.json()
        }).then((data) => {
            for(let i = 0; i < 21; i++) {
                setCurrentMovieCredits((previousArray) => [...previousArray, data.cast[i]])
            }
        })
    }

    function handleWatchLaterQueue() {
        const userId = auth.currentUser.displayName

        set(ref(database, `${userId}/${currentMovie.title}`), {
            posterPath: currentMovie.poster_path
        }).then(() => {
            alert('Success')
        }).catch((error) => {
            console.log(error)
        })
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

            <section className="current-movie-section">
                <div className="current-movie-trailer-container">
                    <iframe width={800} height={450} src={`https://www.youtube.com/embed/${currentVideoKey}?controls=1&autoplay=1&mute=1&rel=0`} frameBorder="0" allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'></iframe>
                    <div onMouseOver={(e) => e.target.classList.add('hover')} className="iframe-tint"></div>
                </div>
                <div className="current-movie-info-section">
                    <div className="current-movie-image-container">
                        <img src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`} alt="" className="current-movie-image"/>
                    </div>
                    <div className="current-movie-info-container">
                        <h1 className="current-movie-title">{currentMovie.title}</h1>
                        <div className="current-movie-release-date-container">
                            <span className="current-movie-release-date-text">Release Date:</span>
                            <span className="current-movie-release-date">{currentMovie.release_date}</span>
                        </div>
                        <div className="current-movie-rating-container">
                            <div className="current-movie-star-rating-container">{currentMovie.vote_average === 0 ? <i className="far fa-star"></i> : currentMovieStarCount.map((number) => {
                                return(
                                    <i className="fas fa-star" key={number}></i>
                                )
                            })}
                            {currentMovie.vote_average > currentMovieStarCount.length && currentMovie.vote_average < currentMovieStarCount.length + 1 ? <i className="fas fa-star-half"></i> : null}
                            </div>
                            <span className="current-movie-rating">{currentMovie.vote_average}</span>
                        </div>
                        <p className="current-movie-info">{currentMovie.overview}</p>
                        <div className="current-movie-button-container">
                            <button><i className="fas fa-play"></i> Watch</button>
                            <button onClick={() => handleWatchLaterQueue()} className="current-movie-watch-list-button"><i className="fas fa-plus"></i> Add to Watch List</button>
                        </div>
                    </div>
                </div>
                
                <div className="current-movie-credit-section">
                    <span className="current-movie-credit-title">Top Billed Cast</span>
                    <div className="current-movie-credit-container">{!currentMovieCredits[0] ? null : currentMovieCredits.map((actor, index) => {
                        if(actor === undefined) {
                            return null
                        }
                        
                        return (
                            <div className={`current-movie-credit-${index + 1} current-movie-credits`} key={index}>
                                <img src={!actor.profile_path ? noCastImage : `https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt="" className={`current-movie-credit-image current-movie-credit-image-${index + 1}`} />
                                <div className="current-movie-credit-info-container">
                                    <span className="current-movie-credit-name">{actor.name}</span>
                                    <span className="current-movie-credit-as">As <span className="current-movie-credit-character">{actor.character}</span></span>
                                </div>
                            </div>
                        )
                    })}</div>
                </div>
            </section>
        </React.Fragment>
    )
};

export default CurrentMovie;
