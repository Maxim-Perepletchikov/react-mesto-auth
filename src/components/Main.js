import { useContext } from 'react'
import Card from './Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

export default function Main({
  cards,
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDelete,
  isLoading,
  spinner
}) {
  const currentUser = useContext(CurrentUserContext)

  return (
    <main className="content">
      <section className="profile">
        <button className="profile__container-avatar" onClick={onEditAvatar}>
          <img
            className="profile__avatar"
            src={isLoading ? spinner : currentUser.avatar}
            alt="Аватар"
          />
        </button>
        <div className="profile__profile-info">
          <h1 className="profile__title-name">{currentUser.name}</h1>
          <button
            className="profile__edit"
            type="button"
            aria-label="Кнопка редактирования"
            onClick={onEditProfile}
          ></button>
          <p className="profile__profession">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="Кнопка добавить"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="gallery">
        {cards.map((props) => (
          <Card
            key={props._id}
            card={props}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  )
}
