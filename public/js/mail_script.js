const contactFormFields = document.getElementsByClassName("contact-form-field")
const contactFormBtn = document.getElementById("send-mail-btn");

const sendEmail = (email, subject, content) => {
    const data = { email, subject, content }

    const promise = new Promise((resolve, reject) => {
        fetch("http://localhost:3000/mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accepted: "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(data => resolve(data))
            .catch(data => reject(data));
    });
    return promise;
}

contactFormBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = contactFormFields[0].value
    const subject = contactFormFields[1].value;
    const content = contactFormFields[2].value;
    sendEmail({ email, subject, content })
});