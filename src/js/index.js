const color = {
    "litige_en_attente": {
        "code": "#622ca0",
        "label": "litige en attente"
    },
    "commande_payee": {
        "code": "#cce0fe",
        "label": "commande payée"
    },
    "bloque": {
        "code": "#ffdccc",
        "label": "Bloqué"
    },
    "modification": {
        "code": "#e2d5f7",
        "label": "Modification"
    },
    "a_prepare": {
        "code": "#cef5d2",
        "label": "Commande à préparer"
    },
    "en_cours": {
        "code": "#cef5d2",
        "label": "En cours de préparation"
    },
    "pret": {
        "code": "#ceedfa",
        "label": "Colis préapré"
    },
    "livraison": {
        "code": "#ffd4df",
        "label": "livraison"
    },
    "retour_annule": {
        "code": "#fcccf0",
        "label": "retourné/annulé"
    }
};


document.addEventListener('DOMContentLoaded', () => {
    let ongletActive = document.querySelector('.active-conteneur-texte-onglet');
    let onglets = document.querySelectorAll('.conteneur-text-onglet');
    let liActive = document.querySelector('.active-text-onglet');
    let li = document.querySelectorAll('.texte-onglet')

    let vues = document.querySelectorAll('.conteneur-text-img');
    let vueActive = document.querySelector('.active');

    let btnDeroulant = document.querySelector('.conteneur-svg-titre');
    let menuObjets = document.querySelector('.menu-deroulant');
    let objets = document.querySelectorAll('.objet');
    let titre = document.querySelector('.titre-header');

    let listeVues = document.querySelector('.conteneur-vues');
    let conteneurBoiteKanban = document.querySelector('.conteneur-boite-kanban');
    let conteneurTableau = document.querySelector('.conteneur-tableau');
    let conteneurFacture = document.querySelector('.conteneur-factures');
    let conteneurBordereau = document.querySelector('.conteneur-bordereaux');
    let conteneurPromo = document.querySelector('.conteneur-promo');

    const tableBody = document.getElementById('table-body');
    const tableFacture = document.getElementById('table-body-facture');
    const tableBordereaux = document.getElementById('table-body-bordereaux');
    const tablePromo = document.getElementById('table-body-promo');

    const draggableItems = document.querySelectorAll('.boite-draggable');
    const dropzones = document.querySelectorAll('.dropzone');
    const contenueBoiteDraggable = document.querySelector('.contenue-boite-draggable')
    titre.textContent = localStorage.getItem('objet');

    renderViewKanban()
    async function renderViewKanban() {

        fetch('http://localhost:8080/commandes/getForViewKanban/' + initial())
            .then(async res => {
                const data = await res.json();
                // Récupération de la zone de drop
                const dropzone_litige = document.getElementById("dropzone1");
                const dropzone_payee = document.getElementById("dropzone2");
                const dropzone_bloque = document.getElementById("dropzone3");
                const dropzone_modification = document.getElementById("dropzone4");
                const dropzone_a_prepare = document.getElementById("dropzone5");
                const dropzone_en_cours = document.getElementById("dropzone6");
                const dropzone_pret = document.getElementById("dropzone7");
                // Création des éléments boite-draggable pour chaque élément dans les données
                data.forEach((item, i) => {

                    // Création de la boite-draggable
                    const boiteDraggable = document.createElement("div");
                    boiteDraggable.classList.add("boite-draggable");
                    boiteDraggable.id = "item" + (i + 1);
                    boiteDraggable.draggable = true;

                    // Création du contenu
                    const imgDraggable = document.createElement("div");
                    imgDraggable.classList.add("contenue-img-draggable");

                    const contenueDraggable = document.createElement("div");
                    contenueDraggable.classList.add("contenue-boite-draggable");
                    contenueDraggable.innerHTML = `
                    <h5 class="titre-div-draggable">${item[1]}</h5>
                    <p class="sous-titre-div-draggable">NOM DU CLIENT</p>
                    <p class="valeur-sous-titre">${item[7]}</p>
                    <p class="sous-titre-div-draggable">REF COMMANDE</p>
                    <p class="valeur-sous-titre">${item[0]}</p>
                    <p class="sous-titre-div-draggable">MONTANT EN TTC</p>
                    <p class="valeur-sous-titre">${"€" + item[4]}</p>
                    `;

                    // Ajout des éléments dans la boite-draggable

                    boiteDraggable.appendChild(imgDraggable);
                    boiteDraggable.appendChild(contenueDraggable);

                    boiteDraggable.addEventListener("dblclick", handleDoubleClick)
                    boiteDraggable.addEventListener("dragstart", handleDragStart);
                    boiteDraggable.addEventListener("dragend", handleDragEnd);
                    boiteDraggable.addEventListener("dragover", handleDragOver);
                    boiteDraggable.addEventListener("dragleave", handleDragLeave);
                    boiteDraggable.addEventListener("drop", handleDrop);

                    // Ajout de la boite-draggable dans la dropzone
                    switch (item[2]) {
                        case "litige_en_cours":
                            dropzone_litige.appendChild(boiteDraggable);
                            break;
                        case "commande_payee":
                            dropzone_payee.appendChild(boiteDraggable);
                            break;
                        case "bloque":
                            dropzone_bloque.appendChild(boiteDraggable);
                            break;
                        case "modification":
                            dropzone_modification.appendChild(boiteDraggable);
                            break;
                        case "a_prepare":
                            dropzone_a_prepare.appendChild(boiteDraggable);
                            break;
                        case "en_cours":
                            dropzone_en_cours.appendChild(boiteDraggable);
                            break;
                        case "pret":
                            dropzone_pret.appendChild(boiteDraggable);
                            break;
                        default:
                            dropzone_litige.appendChild(boiteDraggable);
                    }
                    let key = "ref001";

                    fetch('http://localhost:8080/s3/downloadFile/invoice/' + key)
                        .then(async response => await response.blob())
                        .then(data => {
                            const pdfBlob = new Blob([data], { type: 'application/pdf' });
                            const pdfUrl = URL.createObjectURL(pdfBlob);
                            const embed = document.createElement('embed');
                            embed.src = pdfUrl;
                            embed.classList.add('pdf-embed');
                            imgDraggable.appendChild(embed);
                        })
                        .catch(error => console.error(error));
                });
            })
    }

    // permet de masquer ou afficher le contenue visé en fonction de l'onglet sélectionné
    function affichageContenuOnglet() {


        let tabConteneur = [listeVues, conteneurBoiteKanban, conteneurBordereau, conteneurFacture, conteneurPromo, conteneurTableau];
        switch (ongletActive.textContent) {
            case "Commandes":
                for (i = 0; i < tabConteneur.length; i++) {
                    if (!tabConteneur[i].classList.contains('invisible')) {
                        tabConteneur[i].classList.add('invisible');
                    }
                }
                if (tabConteneur[1].classList.contains('invisible')) {
                    tabConteneur[1].classList.remove('invisible');
                }
                if (tabConteneur[0].classList.contains('invisible')) {
                    tabConteneur[0].classList.remove('invisible');
                }
                break;
            case "Factures & Etiquettes":
                for (i = 0; i < tabConteneur.length; i++) {
                    if (!tabConteneur[i].classList.contains('invisible')) {
                        tabConteneur[i].classList.add('invisible');
                    }
                }
                if (tabConteneur[3].classList.contains('invisible')) {
                    tabConteneur[3].classList.remove('invisible');
                }
                break;
            case "Bordereaux":
                for (i = 0; i < tabConteneur.length; i++) {
                    if (!tabConteneur[i].classList.contains('invisible')) {
                        tabConteneur[i].classList.add('invisible');
                    }
                }
                if (tabConteneur[2].classList.contains('invisible')) {
                    tabConteneur[2].classList.remove('invisible');
                }
                break;
            case "Codes promo":
                for (i = 0; i < tabConteneur.length; i++) {
                    if (!tabConteneur[i].classList.contains('invisible')) {
                        tabConteneur[i].classList.add('invisible');
                    }
                }
                if (tabConteneur[4].classList.contains('invisible')) {
                    tabConteneur[4].classList.remove('invisible');
                }
                break;
        }
        //restaure la vue numéro 1 comme active dans le cas où on aurait cliqué sur les onglets avec en vue : Tableau de suivie - par état
        if (vueActive == vues[1]) {
            vues[0].classList.add('active');
            vues[1].classList.remove('active');
            vueActive = vues[0];
        }
    }

    // permet de masquer ou d'afficher le contnue visé en fonction de la vue selectionné
    function affichageContenuView(i) {


        let textvu = document.querySelectorAll('.texte-vue');
        let tabViews = [conteneurBoiteKanban, conteneurTableau];

        for (let j = 0; j < tabViews.length; j++) {
            tabViews[j].classList.add('invisible');
        }

        if (tabViews[i].classList.contains('invisible')) {
            tabViews[i].classList.remove('invisible');
        }
    }

    // permet de donner la bonne class pour le bon onglet (tableau du haut)
    for (let i = 0; i < onglets.length; i++) {


        onglets[i].addEventListener('click', () => {
            onglets[i].classList.add('active-conteneur-texte-onglet');
            li[i].classList.add('active-text-onglet');
            ongletActive.classList.remove('active-conteneur-texte-onglet');
            liActive.classList.remove('active-text-onglet');
            ongletActive = onglets[i];
            liActive = li[i];
            affichageContenuOnglet();
        })
    }

    // permet de donner la class active pour la bonne vue (tableau de gauche)
    for (let i = 0; i < vues.length; i++) {


        vues[i].addEventListener('click', () => {
            if (!vues[i].classList.contains('active')) {
                vues[i].classList.add('active');
                vueActive.classList.remove('active');
                vueActive = vues[i];
                affichageContenuView(i);
                renderTableOrder();
            }
        })
    }

    btnDeroulant.addEventListener('click', () => {


        if (menuObjets.classList.contains('menu-deroulant')) {
            menuObjets.classList.remove('menu-deroulant');
            menuObjets.classList.add('menu-deroulant-visible');
        } else {
            menuObjets.classList.add('menu-deroulant');
            menuObjets.classList.remove('menu-deroulant-visible');
        }
        for (let i = 0; i < objets.length; i++) {
            objets[i].addEventListener('click', () => {
                console.log("1")
                localStorage.setItem('objet', 'Commandes - Site ' + objets[i].textContent)
                location.reload()
            })
        }
        if (menuObjets.classList.contains('menu-deroulant-visible')) {
            document.addEventListener('click', (event) => {
                if (event.target.classList != 'titre-header') {
                    menuObjets.classList.add('menu-deroulant');
                    menuObjets.classList.remove('menu-deroulant-visible');
                }
            })
        }
    })

    draggableItems.forEach((item) => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragend", handleDragEnd);
    });

    dropzones.forEach((zone) => {
        zone.addEventListener("dragover", handleDragOver);
        zone.addEventListener("dragleave", handleDragLeave);
        zone.addEventListener("drop", handleDrop);
    });

    function handleDragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
        e.target.classList.add("dragging");
    }

    function handleDragEnd(e) {
        e.target.classList.remove("dragging");
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.target.classList.add("dropzone-over");
    }

    function handleDragLeave(e) {
        e.target.classList.remove("dropzone-over");
    }

    function handleDrop(e) {
        e.preventDefault();
        const draggedItemId = e.dataTransfer.getData("text/plain");
        const draggedItem = document.getElementById(draggedItemId);
        const targetZone = e.target.closest('.dropzone');
        if (targetZone && targetZone !== draggedItem.closest('.dropzone')) {
            targetZone.appendChild(draggedItem);
            const zoneName = targetZone.getAttribute('id');
            let i = draggedItem.children;
            let j = i[1].children
            updateStateOrder(zoneName, j[4].textContent);
        }
        dropzones.forEach((zone) => {
            zone.classList.remove("dropzone-over");
        })
    }

    function handleDoubleClick(e) {


        const overlayDiv = document.createElement("div");
        overlayDiv.id = "overlay";
        document.body.appendChild(overlayDiv);

        const popUp = document.createElement("div");
        popUp.id = "centered";
        document.body.appendChild(popUp);
        if (popUp) {
            document.addEventListener('click', (event) => {
                if (!popUp.contains(event.target)) {
                    document.body.removeChild(popUp);
                    const overlay = document.getElementById("overlay")
                    overlay.parentNode.removeChild(overlay)
                }
            })
        }
        let ref = e.target.parentNode.children[4].textContent
        displayPopup(popUp, ref)


    }

    function displayPopup(popUp, ref) {

        fetch("http://localhost:8080/commandes/getDetailForOneOrder/" + ref)
            .then(response => response.json())
            .then(data => {
                // Faites quelque chose avec les données récupérées
                console.log(data);

                // création des éléments du pop up 
                // reference
                const refCommandeLabel = document.createElement("label");
                refCommandeLabel.textContent = "Référence de commande:";
                const refCommandeInput = document.createElement("input");
                refCommandeInput.type = "text";
                refCommandeInput.setAttribute("readonly", "");
                refCommandeInput.value = data[0][0];

                const divRefCommande = document.createElement("div");
                divRefCommande.appendChild(refCommandeLabel);
                divRefCommande.appendChild(refCommandeInput);
                popUp.appendChild(divRefCommande);


                // invoice_number
                const numFactureLabel = document.createElement("label");
                numFactureLabel.textContent = "Numéro de facture:";
                const numFactureInput = document.createElement("input");
                numFactureInput.type = "text";
                numFactureInput.setAttribute("readonly", "");
                numFactureInput.value = data[0][1]

                const divNumFacture = document.createElement("div");
                divNumFacture.appendChild(numFactureLabel);
                divNumFacture.appendChild(numFactureInput);
                popUp.appendChild(divNumFacture);


                // state_order
                const stateOrderLabel = document.createElement("label");
                stateOrderLabel.textContent = "État de la commande:";
                const stateOrderInput = document.createElement("input");
                stateOrderInput.type = "text";
                stateOrderInput.value = data[0][2];

                const divStateOrder = document.createElement("div");
                divStateOrder.appendChild(stateOrderLabel);
                divStateOrder.appendChild(stateOrderInput);
                popUp.appendChild(divStateOrder);


                // customer_message 
                const customerMessageLabel = document.createElement("label");
                customerMessageLabel.textContent = "Message du client:";
                const customerMessageInput = document.createElement("input");
                customerMessageInput.type = "text";
                customerMessageInput.value = data[0][3];
                
                const divCustomerMessage = document.createElement("div");
                divCustomerMessage.appendChild(customerMessageLabel);
                divCustomerMessage.appendChild(customerMessageInput);
                popUp.appendChild(divCustomerMessage);

                // invoice_key 
                const invoiceKeyLabel = document.createElement("label");
                invoiceKeyLabel.textContent = "Clé de facture:";
                const invoiceKeyInput = document.createElement("input");
                invoiceKeyInput.type = "text";
                invoiceKeyInput.setAttribute("readonly", "");
                invoiceKeyInput.value = data[0][4];

                const divInvoiceKey = document.createElement("div");
                divInvoiceKey.appendChild(invoiceKeyLabel);
                divInvoiceKey.appendChild(invoiceKeyInput);
                popUp.appendChild(divInvoiceKey);

                // amount_ttc 
                const amountTTCLabel = document.createElement("label");
                amountTTCLabel.textContent = "Montant TTC:";
                const amountTTCInput = document.createElement("input");
                amountTTCInput.type = "text";
                amountTTCInput.value = data[0][5];

                const divAmountTTC = document.createElement("div");
                divAmountTTC.appendChild(amountTTCLabel);
                divAmountTTC.appendChild(amountTTCInput);
                popUp.appendChild(divAmountTTC);
                // amount_ht 
                const amountHTLabel = document.createElement("label");
                amountHTLabel.textContent = "Montant HT:";
                const amountHTInput = document.createElement("input");
                amountHTInput.type = "text";
                amountHTInput.value = data[0][6];

                const divAmountHT = document.createElement("div");
                divAmountHT.appendChild(amountHTLabel);
                divAmountHT.appendChild(amountHTInput);
                popUp.appendChild(divAmountHT);
                // firstname 
                const firstNameLabel = document.createElement("label");
                firstNameLabel.textContent = "Prénom:";
                const firstNameInput = document.createElement("input");
                firstNameInput.type = "text";
                firstNameInput.value = data[0][7];
                
                const divFirstName = document.createElement("div");
                divFirstName.appendChild(firstNameLabel);
                divFirstName.appendChild(firstNameInput);
                popUp.appendChild(divFirstName);
                // forename  
                const nomClientLabel = document.createElement("label");
                nomClientLabel.textContent = "Nom du client:";
                const nomClientInput = document.createElement("input");
                nomClientInput.type = "text";
                nomClientInput.value = data[0][8]

                const divNomClient = document.createElement("div");
                divNomClient.appendChild(nomClientLabel);
                divNomClient.appendChild(nomClientInput);
                popUp.appendChild(divNomClient);

                // phone_number
                const phoneNumberLabel = document.createElement("label");
                phoneNumberLabel.textContent = "Numéro de téléphone:";
                const phoneNumberInput = document.createElement("input");
                phoneNumberInput.type = "text";
                phoneNumberInput.value = data[0][9];

                const divPhoneNumber = document.createElement("div");
                divPhoneNumber.appendChild(phoneNumberLabel);
                divPhoneNumber.appendChild(phoneNumberInput);
                popUp.appendChild(divPhoneNumber);

                // creation_date
                const creationDateLabel = document.createElement("label");
                creationDateLabel.textContent = "Date de création:";
                const creationDateInput = document.createElement("input");
                creationDateInput.type = "text";
                creationDateInput.setAttribute("readonly", "");
                creationDateInput.value = new Date(data[0][10]).toISOString().substring(0, 10);

                const divCreationDate = document.createElement("div");
                divCreationDate.appendChild(creationDateLabel);
                divCreationDate.appendChild(creationDateInput);
                popUp.appendChild(divCreationDate);

                // date_last_changed
                const dateLastChangedLabel = document.createElement("label");
                dateLastChangedLabel.textContent = "Date de dernière modification:";
                const dateLastChangedInput = document.createElement("input");
                dateLastChangedInput.type = "text";
                dateLastChangedInput.setAttribute("readonly", "");
                dateLastChangedInput.value = new Date(data[0][11]).toISOString().substring(0, 10);

                const divDateLastChanged = document.createElement("div");
                divDateLastChanged.appendChild(dateLastChangedLabel);
                divDateLastChanged.appendChild(dateLastChangedInput);
                popUp.appendChild(divDateLastChanged);

                // payment_mode
                const paymentModeLabel = document.createElement("label");
                paymentModeLabel.textContent = "Mode de paiement:";
                const paymentModeInput = document.createElement("input");
                paymentModeInput.type = "text";
                paymentModeInput.setAttribute("readonly", "");
                paymentModeInput.value = data[0][12];

                const divPaymentMode = document.createElement("div");
                divPaymentMode.appendChild(paymentModeLabel);
                divPaymentMode.appendChild(paymentModeInput);
                popUp.appendChild(divPaymentMode);

                // delivery_label
                const deliveryLabelLabel = document.createElement("label");
                deliveryLabelLabel.textContent = "Mode de livraison:";
                const deliveryLabelInput = document.createElement("input");
                deliveryLabelInput.type = "text";
                deliveryLabelInput.value = data[0][13];

                const divDeliveryLabel = document.createElement("div");
                divDeliveryLabel.appendChild(deliveryLabelLabel);
                divDeliveryLabel.appendChild(deliveryLabelInput);
                popUp.appendChild(divDeliveryLabel);

                // user_id
                const userIdLabel = document.createElement("label");
                userIdLabel.textContent = "Identifiant utilisateur:";
                const userIdInput = document.createElement("input");
                userIdInput.type = "text";
                userIdInput.setAttribute("readonly", "");
                userIdInput.value = data[0][14];

                const divUserId = document.createElement("div");
                divUserId.appendChild(userIdLabel);
                divUserId.appendChild(userIdInput);
                popUp.appendChild(divUserId);

                // web_site
                const webSiteLabel = document.createElement("label");
                webSiteLabel.textContent = "Site web:";
                const webSiteInput = document.createElement("input");
                webSiteInput.type = "text";
                webSiteInput.value = data[0][15];

                const divWebSite = document.createElement("div");
                divWebSite.appendChild(webSiteLabel);
                divWebSite.appendChild(webSiteInput);
                popUp.appendChild(divWebSite);

                // comment
                const commentaireLabel = document.createElement("label");
                commentaireLabel.textContent = "Commentaire:";
                const commentaireInput = document.createElement("input");
                commentaireInput.type = "text";
                commentaireInput.value = data[0][16]

                const divCommentaire = document.createElement("div");
                divCommentaire.appendChild(commentaireLabel);
                divCommentaire.appendChild(commentaireInput);
                popUp.appendChild(divCommentaire);
                

                
                // Détail de la commande (fichier pdf)
                const detailcommandeLabel = document.createElement("label");
                detailcommandeLabel.textContent = "Détail de la commande:";
                const lienDetailCommande = document.createElement("a");
                lienDetailCommande.textContent = "Cliquez ici pour voir le détail de la commande";
                lienDetailCommande.href = "../../tools/pdf/facture.pdf";
                lienDetailCommande.target = "_blank"
                lienDetailCommande.style.color = "blue";
                lienDetailCommande.style.textDecoration = "underline";

                const divDetailCommande = document.createElement("div");
                divDetailCommande.appendChild(detailcommandeLabel);
                divDetailCommande.appendChild(lienDetailCommande);

                popUp.appendChild(divDetailCommande)

                // création du bouton Enregistrer
                const enregistrerButton = document.createElement("button");
                enregistrerButton.type = "submit"
                enregistrerButton.textContent = "Enregistrer";
                enregistrerButton.addEventListener("click", () => {
                    
                    data[0][2] = stateOrderInput.value
                    data[0][3] = customerMessageInput.value
                    data[0][5] = amountTTCInput.value
                    data[0][6] = amountHTInput.value
                    data[0][7] = firstNameInput.value
                    data[0][8] = nomClientInput.value
                    data[0][9] = phoneNumberInput.value
                    data[0][13] = deliveryLabelInput.value
                    data[0][15] = webSiteInput.value
                    data[0][16] = commentaireInput.value

                    console.log(data[0])
                    updateOrder(data[0]);
                });
                const divEnregistrer = document.createElement("div");
                divEnregistrer.appendChild(enregistrerButton);
                popUp.appendChild(divEnregistrer)
            })
            .catch(error => {
                // Gérez les erreurs de requête
                console.error(error);
            });
    }

    async function updateOrder(data) {
        console.log(data);
        const updatedOrder = {
            data : [data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10].substring(0,10),data[11].substring(0,10),data[12],data[13],data[14],data[15],data[16]]
        };
        try {
            const response = await fetch("http://localhost:8080/commandes/updateOrder", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedOrder),
            });
            const data = await response.json();
            console.log(`Comment updated for order`);
        } catch (error) {
            console.error(`Error updating comment for order ${error}`);
        }
    }

    async function colorForState(state) {
        if (color.hasOwnProperty(state)) {
            return Promise.resolve([color[state].code, color[state].label]);
        } else {
            return Promise.resolve(null);
        }
    }

    function initial() {
        let initial = "";
        tableBody.innerHTML = ''

        if (titre.textContent == "Commandes - Site Prescription Nature") {
            return initial = "pn";
        } else if (titre.textContent == "Commandes - Site Body Full") {
            return initial = "bf";
        }
    }

    async function renderTableOrder() {
        fetch('http://localhost:8080/commandes/getByEtat/' + initial())
            .then(async res => {
                const data = await res.json();
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    const conteneurStateOrder = document.createElement('div');
                    conteneurStateOrder.classList.add('conteneur-state-order');
                    if (item[2] == "litige_en_attente") {
                        conteneurStateOrder.style.color = "white";
                    }
                    let dataState = await colorForState(item[2]);
                    conteneurStateOrder.style.backgroundColor = dataState[0];
                    conteneurStateOrder.textContent = dataState[1];

                    const row = document.createElement('tr');
                    row.innerHTML = `
                                <td>${item[0]}</td>
                                <td>${item[1]}</td>
                                <td></td>
                                <td>${item[3]}</td>
                                <td>${item[4]}</td>
                                <td>${item[5]}</td>
                                <td>${item[6]}</td>
                                <td>${item[7]}</td>
                                <td>${item[8]}</td>
                                <td>${item[9]}</td>
                                <td>${item[10]}</td>
                                <td>${item[11]}</td>
                                <td>${item[12]}</td>
                                `;
                    row.querySelector('td:nth-child(3)').appendChild(conteneurStateOrder);

                    tableBody.appendChild(row);
                }
            });
    }

    async function updateStateOrder(newState, ref) {
        switch (newState) {
            case "dropzone1":
                newState = "litige_en_attente"
                break;
            case "dropzone2":
                newState = "commande_payee"
                break;
            case "dropzone3":
                newState = "bloque"
                break;
            case "dropzone4":
                newState = "modification"
                break;
            case "dropzone5":
                newState = "a_prepare"
                break;
            case "dropzone6":
                newState = "en_cours"
                break;
            case "dropzone7":
                newState = "pret"
                break;
            case "dropzone8":
                newState = "livraison"
                break;
            case "dropzone9":
                newState = "retour_annule"
                break;
            default:
                newState = "litige_en_cours"
        }
        const body = {
            "ref": ref,
            "newState": newState
        }
        fetch('http://localhost:8080/commandes/updateStateOrder', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(async res => {
                const data = await res.json();
            })
    }
});