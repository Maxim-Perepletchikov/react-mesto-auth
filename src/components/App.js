import { useState, useEffect } from 'react'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import ImagePopup from './ImagePopup'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import api from '../utils/api'
import Login from './Login'
import Register from './Register'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import * as auth from '../utils/auth'
import InfoTooltip from './InfoTooltip'
import CardDeletePopup from './CardDeletePopup'
import spinner from '../images/loading-loading-forever.gif'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isInfoTooltip, setIsInfoTooltip] = useState(false)
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = useState(false)

  const [selectedCard, setSelectedCard] = useState({})
  const [cardForDelete, setCardForDelete] = useState({})
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
    isCardDeletePopupOpen ||
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
    if (loggedIn) {
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
    }
  }, [loggedIn])

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleCardDeleteRequest(card) {
    setIsCardDeletePopupOpen(true)
    setCardForDelete(card)
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsInfoTooltip(false)
    setIsCardDeletePopupOpen(false)
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
        closeAllPopups()
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
    if (isOpen) {
      function closeByEscape(evt) {
        if (evt.key === 'Escape') {
          closeAllPopups()
        }
      }
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
              loggedIn ? <ProtectedRoute
                component={Main}
                loggedIn={loggedIn}
                cards={cards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDeleteRequest}
                isLoading={isLoading}
                spinner={spinner}
              /> : <div className='spinner'>
              <img src={spinner} alt='анимация загрузки'/>
            </div>
            }
          />
          <Route path='*' element={
            loggedIn ? <Navigate to="/"/> : <Navigate to="/sign-in"/>
          } />
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

        <CardDeletePopup 
          isOpen={isCardDeletePopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          card={cardForDelete}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
