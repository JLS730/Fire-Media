import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../scripts/firebase';
import { database } from '../scripts/firebase';
import { ref, get, remove } from "firebase/database";

import '../styles/watch-later.css'

const WatchLater = () => {
  const navigate = useNavigate()

  const [currentUserWatchList, setCurrentUserWatchList] = useState([])
  const [currentUserWatchListPoster, setCurrentUserWatchListPoster] = useState([])

  const movieTitleValueRef = useRef(new Array())

  useEffect(() => {
    handleGetDatabase()
  }, [])

  function handleSignOut() {
    auth.signOut()

    navigate('/')
  }

  function handleGetDatabase() {
    get(ref(database)).then((snapshot) => {
      const currentUser = auth.currentUser.displayName

      if(snapshot) {
        const snapshotObject = snapshot.val()[currentUser]

        setCurrentUserWatchListPoster(Object.values(snapshotObject))
        setCurrentUserWatchList(Object.keys(snapshotObject))
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  function handleRemoveFromWatchLater(index) {
    remove(ref(database, `${auth.currentUser.displayName}/${movieTitleValueRef.current[index].textContent}`))

    movieTitleValueRef.current[index].parentElement.parentElement.remove()
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

        <section className="watch-list-section">
            <div className="watch-list-container">
              {currentUserWatchList.map((movie, index) => {
                return (
                  <div className="watch-list-movie-containers" key={index}>
                    <img src={`https://image.tmdb.org/t/p/w500${currentUserWatchListPoster[index].posterPath}`} alt="" className="watch-list-movie-image" />
                    <div className="watch-list-movie-name-container">
                        <span className="watch-list-movie-name" ref={(element) => movieTitleValueRef.current.push(element)}>{movie}</span>
                    </div>
                    <div className="watch-list-button-container">
                        <button className="watch-list-watch-button"><i className="fas fa-play"></i>  Watch</button>
                        <button onClick={() => handleRemoveFromWatchLater(index)} className="watch-list-trash-button"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                )
              })}
            </div>
        </section>
    </React.Fragment>
  )
};

export default WatchLater;