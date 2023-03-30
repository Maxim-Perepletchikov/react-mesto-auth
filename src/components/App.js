import { useState, useEffect } from 'react'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import PopupWithForm from './PopupWithForm'
import ImagePopup from './ImagePopup'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import api from '../utils/api'
import { Route, Routes } from 'react-router'
import ProtectedRoute from './ProtectedRoute'
import Register from './Register'
import Login from './Login'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)

  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})

  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState(
    isLoading ? 'Сохранение...' : 'Сохранить'
  )

  const [loggedIn, setLoggedIn] = useState(false)

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.isOpen

  useEffect(() => {
    setIsLoading(true)
    api
      .getInfoProfile()
      .then((data) => {
        setCurrentUser(data)
      })
      .catch(console.log)

    api
      .getInitialCards()
      .then((data) => {
        setCards(
          data.map((item) => ({
            _id: item._id,
            likes: item.likes,
            name: item.name,
            link: item.link,
            owner: item.owner,
          }))
        )
      })
      .catch(console.log)
      .finally(() => setIsLoading(false))
  }, [])

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setSelectedCard({ ...selectedCard, isOpen: false })
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id)

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        )
      })
      .catch(console.log)
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id))
      })
      .catch(console.log)
  }

  function handleUpdateUser(userInfo) {
    setButtonText('Сохранение...')
    api
      .setInfoProfile(userInfo)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo)
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => setButtonText('Сохранить'))
  }

  function handleUpdateAvatar(avatar) {
    setButtonText('Сохранение...')
    api
      .setAvatar(avatar)
      .then((newAvatar) => {
        setCurrentUser(newAvatar)
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => setButtonText('Сохранить'))
  }

  function handleAddPlace(card) {
    setButtonText('Сохранение...')
    api
      .setCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards])
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => setButtonText('Сохранить'))
  }

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape)
      return () => {
        document.removeEventListener('keydown', closeByEscape)
      }
    }
  }, [isOpen])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Routes>
          <ProtectedRoute
            path="/"
            component={Main}
            loggedIn={loggedIn}
            cards={cards}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            isLoading={isLoading}
          />
          <Route
            path="/sigh-up"
            element={Register}
            isLoggedId={loggedIn}
            onLogin={cbRegister} //..
          />
          <Route
            path="/sigh-in"
            element={Login}
            isLoggedId={loggedIn}
            onLogin={cbLogin} //..
          />
          <Route>
            {loggedIn ? <Redirect to="/sigh-up" /> : <Redirect to="/sigh-in" />}
          </Route>
        </Routes>
        {/* <Main
          cards={cards}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          isLoading={isLoading}
        /> */}
        <Footer />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          buttonText={buttonText}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          buttonText={buttonText}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
          buttonText={buttonText}
        />

        <PopupWithForm name="delete-card" title="Вы уверенны?" />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
