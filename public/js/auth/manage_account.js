import appendErrorNotification from "../ui/error/error_popup.js";

export const deleteAccount = (inputedEmail) => (
  new Promise((resolve, reject) => (
    fetch('/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        accepted: 'applcation/json',
      },
      body: JSON.stringify({ inputedEmail }),
    })
      .then((response) => {
        if (!response.ok) {
          response.text().then((data) => (
            appendErrorNotification(data)
          ));
          throw Error(response.statusText);
        }

        return response.text();
      })
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  )));

export const updateAccount = (userData) => (
  new Promise((resolve, reject) => (
    fetch('/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        accepted: 'applcation/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  ))
);
