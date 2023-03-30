const options = {
  url: 'https://mesto.nomoreparties.co/v1/cohort-59',
  headers: {
    authorization: '30812f22-45b0-4eb1-a698-1f92d9f66ac5',
    'Content-Type': 'application/json',
  },
}

class Api {
  constructor(options) {
    this._url = options.url
    this._header = options.headers
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json()
    }

    return Promise.reject(`Ошибка: ${res.status}`)
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._header,
    }).then(this._checkResponse)
  }

  setCard({ name, link }) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._header,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this._checkResponse)
  }

  setInfoProfile({ name, about }) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._header,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(this._checkResponse)
  }

  getInfoProfile() {
    return fetch(`${this._url}/users/me`, {
      headers: this._header,
    }).then(this._checkResponse)
  }

  setLike(id) {
    return fetch(`${this._url}/cards/likes/${id}`, {
      method: 'PUT',
      headers: this._header,
    }).then(this._checkResponse)
  }

  deleteLike(id) {
    return fetch(`${this._url}/cards/likes/${id}`, {
      method: 'DELETE',
      headers: this._header,
    }).then(this._checkResponse)
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: 'DELETE',
      headers: this._header,
    }).then(this._checkResponse)
  }

  setAvatar(avatar) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._header,
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._checkResponse)
  }

  changeLikeCardStatus(id, isLiked) {
    return isLiked ? this.setLike(id) : this.deleteLike(id)
  }
}

export default new Api(options)
