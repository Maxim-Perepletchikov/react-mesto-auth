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
import Login from './Login'
import Register from './Register'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import * as auth from '../utils/auth'
import InfoTooltip from './InfoTooltip'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isInfoTooltip, setIsInfoTooltip] = useState(false)

  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})

  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState(
    isLoading ? 'Сохранение...' : 'Сохранить'
  )

  const [loggedIn, setLoggedIn] = useState(false)
  // const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('')
  const [message, setMessage] = useState({
    status: false,
    text: ''
  })

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isInfoTooltip ||
    selectedCard.isOpen

  const navigate = useNavigate()

  function handleRegister(values) {
    auth.register(values.emailInput, values.passwordInput)
      .then(() => {
        setMessage({
          status: true,
          text: 'Вы успешно зарегистрировались!'
        })
        navigate('/sign-in', {replace: true})
      })
      .catch(() => {
        setMessage({
          status: false,
          text: 'Что-то пошло не так! Попробуйте ещё раз.'
        })
      })
      .finally(() => setIsInfoTooltip(true))
  }

  function handleLogin(values) {
    auth.authorize(values.emailInput, values.passwordInput)
    .then(res => {
      localStorage.setItem('jwt', res.token)
      setLoggedIn(true)
      navigate('/', {replace: true})
      setUserEmail(values.emailInput)
    })
    .catch(() => {
      setMessage({
        status: false,
        text: 'Что-то пошло не так! Попробуйте ещё раз.'
      })
      setIsInfoTooltip(true)
    })
    // .finally(() => setLoading(false))
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt')
    if(jwt) {
      auth.getContent(jwt)
        .then(res => {
          setLoggedIn(true)
          setUserEmail(res.data.email)
          navigate('/', {replace: true})
        })
        .catch(console.log)
    }
  }

  useEffect(() => tokenCheck(), [])

  function handleLogout() {
    setLoggedIn(false)
    localStorage.removeItem('jwt')
    setUserEmail('')
    navigate('/sign-in')
  }

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
    setIsInfoTooltip(false)
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
        <Header userEmail={userEmail} onLogout={handleLogout} />
        <Routes>
          <Route path="/sign-up" element={<Register onRegister={handleRegister} />}  />
          <Route path="/sign-in" element={<Login onLogin={handleLogin}/>} />
          <Route
            path="/"
            element={
              <ProtectedRoute
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
            }
          />
        </Routes>

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

        <InfoTooltip 
          isOpen={isInfoTooltip}
          onClose={closeAllPopups}
          message={message}
        />

        <PopupWithForm name="delete-card" title="Вы уверенны?" />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
