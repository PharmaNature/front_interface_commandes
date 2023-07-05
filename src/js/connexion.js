
const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        //const hashedPassword = bcrypt.hash(password, 10);
        //console.log(hashedPassword);
        fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
                }

                return response.json();
            })
            .then(data => {
                if (data.token != null) {
                    // Stocker le token JWT dans le local storage
                    localStorage.setItem('token', data.token);
                    // Rediriger l'utilisateur vers une autre page
                    window.location.href = '../html/home.html';
                }
                else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error(error);
                // Afficher un message d'erreur à l'utilisateur
                const message = document.getElementById('message');
                message.textContent = error.message;
            });
    });
