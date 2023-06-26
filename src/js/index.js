
//require('dotenv').config();
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
    const tableFacture = document.getElementById('table-body-factures');
    const tableBordereaux = document.getElementById('table-body-bordereaux');
    const tablePromo = document.getElementById('table-body-promo');

    const draggableItems = document.querySelectorAll('.boite-draggable');
    const dropzones = document.querySelectorAll('.dropzone');
    const contenueBoiteDraggable = document.querySelector('.contenue-boite-draggable')

    let token = ""
    if(localStorage.getItem('objet')){
        titre.textContent = localStorage.getItem('objet');
    }
    if(localStorage.getItem('token')){
        token = localStorage.getItem('token');
    }

    renderViewKanban()
    async function renderViewKanban() {

        //fetch('http://'+process.env.URL+':8080/commandes/getForViewKanban/' + initial())
        fetch('http://localhost:8080/commandes/getForViewKanban/' + initial(),{
        headers: {
            "authorization": token
        }})
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

                    //fetch('http://'+process.env.URL+':8080/s3/downloadFile/invoice/' + key)
                    fetch('http://localhost:8080/s3/downloadFile/invoice/' + key,{
                        headers: {
                            "authorization": token
                        }})

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

    function displayElementInPopup(popUp,data,textLabel,isReadOnly,indexData,isADate){

        const label = document.createElement("label");
        label.textContent = textLabel+": ";
        const input = document.createElement("input");
        input.type = "text";
        if (isReadOnly) {
            input.setAttribute("readonly", "");
        }
        if (isADate) {
            input.value = new Date(data[0][indexData]).toLocaleString().substring(0,10);
        }else{
        input.value = data[0][indexData];
        }
        const div = document.createElement("div");
        div.appendChild(label);
        div.appendChild(input);
        popUp.appendChild(div);

        return input
    }

    function displayPopup(popUp, ref) {

        fetch('http://localhost:8080/commandes/getDetailForOneOrder/' + ref,{
            headers: {
                "authorization": token
            }})
            .then(response => response.json())
            .then(data => {
                // Faites quelque chose avec les données récupérées
                console.log(data);
                // création des éléments du pop up 
                const elements = {
                    "Référence de commande": {
                        values: [true, 0, false],
                        elementWeb: null
                    },
                    "Numéro de facture": {
                        values: [true, 1, false],
                        elementWeb: null
                    },
                    "État de la commande": {
                        values: [false, 2, false],
                        elementWeb: null
                    },
                    "Message du client": {
                        values: [false, 3, false],
                        elementWeb: null
                    },
                    "Clé de facture": {
                        values: [true, 4, false],
                        elementWeb: null
                    },
                    "Montant TTC": {
                        values: [false, 5, false],
                        elementWeb: null
                    },
                    "Montant HT": {
                        values: [false, 6, false],
                        elementWeb: null
                    },
                    "Prénom": {
                        values: [false, 7, false],
                        elementWeb: null
                    },
                    "Nom": {
                        values: [false, 8, false],
                        elementWeb: null
                    },
                    "Numéro de téléphone": {
                        values: [false, 9, false],
                        elementWeb: null
                    },
                    "Date de création": {
                        values: [true, 10, true],
                        elementWeb: null
                    },
                    "Date de dernière modification": {
                        values: [true, 11, true],
                        elementWeb: null
                    },
                    "Mode de paiement": {
                        values: [true, 12, false],
                        elementWeb: null
                    },
                    "Mode de livraison": {
                        values: [false, 13, false],
                        elementWeb: null
                    },
                    "Identifiant utilisateur": {
                        values: [true, 14, false],
                        elementWeb: null
                    },
                    "Site web": {
                        values: [false, 15, false],
                        elementWeb: null
                    },
                    "Commentaire": {
                        values: [false, 16, false],
                        elementWeb: null
                    }
                };

                for (const key in elements) {
                    if (elements.hasOwnProperty(key)) {
                        const element = elements[key];
                        const elementWeb = displayElementInPopup(popUp, data, key, element.values[0], element.values[1], element.values[2]);
                        element.elementWeb = elementWeb;
                    }
                }

                // Etiquette de livraison (fichier pdf)
                const detailcommandeLabel = document.createElement("label");
                detailcommandeLabel.textContent = "Etiquette de livraison:";
                const lienDetailCommande = document.createElement("a");
                lienDetailCommande.textContent = "Télécharger";
                const imgEtiquette = document.createElement("img");
                imgEtiquette.src = "../../tools/svg/download.svg";
                imgEtiquette.alt = "Etiquette de livraison";
                imgEtiquette.classList.add("icon-svg-xl"); // Ajout de la classe
                lienDetailCommande.appendChild(imgEtiquette);
                lienDetailCommande.addEventListener("click", function () {
                    // getDeliveryLabel(data[0][0])
                    getDeliveryLabel("ref001")
                    // TOCHANGE
                });
                imgEtiquette.addEventListener("click", function () {
                    // getDeliveryLabel(data[0][0])
                    getDeliveryLabel("ref001")
                    // TOCHANGE
                });
                lienDetailCommande.classList.add('lien-detail-commande');

                const divDetailCommande = document.createElement("div");
                divDetailCommande.classList.add('div-svg-lien_popUp')
                divDetailCommande.appendChild(imgEtiquette);
                divDetailCommande.appendChild(lienDetailCommande);
                detailcommandeLabel.appendChild(divDetailCommande);

                popUp.appendChild(detailcommandeLabel);

                // Facture de la commande (fichier pdf)
                const invoiceCommandeLabel = document.createElement("label");
                invoiceCommandeLabel.textContent = "Facture de la commande:";
                const lienInvoiceCommande = document.createElement("a");
                lienInvoiceCommande.textContent = "Télécharger";
                const imgFacture = document.createElement('img')
                imgFacture.src = "../../tools/svg/download.svg";
                imgFacture.alt = "Facture de la commande";
                imgFacture.classList.add("icon-svg-xl"); // Ajout de la classe
                lienInvoiceCommande.appendChild(imgFacture);
                lienInvoiceCommande.addEventListener("click", function () {
                    // getInvoice(data[0][0])
                    getInvoice("ref001")
                    // TOCHANGE

                });
                imgFacture.addEventListener("click", function () {
                    // getInvoice(data[0][0])
                    getInvoice("ref001")
                    // TOCHANGE

                });
                lienInvoiceCommande.classList.add('lien-detail-commande');

                const divInvoiceCommande = document.createElement("div");
                divInvoiceCommande.classList.add('div-svg-lien_popUp')
                divInvoiceCommande.appendChild(imgFacture);
                divInvoiceCommande.appendChild(lienInvoiceCommande);
                invoiceCommandeLabel.appendChild(divInvoiceCommande);

                popUp.appendChild(invoiceCommandeLabel);


                // création du bouton Enregistrer
                const enregistrerButton = document.createElement("button");
                enregistrerButton.type = "submit"
                enregistrerButton.textContent = "Enregistrer";
                enregistrerButton.addEventListener("click", () => {
                    console.log(elements["État de la commande"].elementWeb.value);
                    data[0][2] = elements["État de la commande"].elementWeb.value
                    data[0][3] = elements["Message du client"].elementWeb.value
                    data[0][5] = elements["Montant TTC"].elementWeb.value
                    data[0][6] = elements["Montant HT"].elementWeb.value
                    data[0][7] = elements["Prénom"].elementWeb.value
                    data[0][8] = elements["Nom"].elementWeb.value
                    data[0][9] = elements["Numéro de téléphone"].elementWeb.value
                    data[0][11] = new Date().toUTCString()
                    data[0][13] = elements["Mode de livraison"].elementWeb.value
                    data[0][15] = elements["Site web"].elementWeb.value
                    data[0][16] = elements["Commentaire"].elementWeb.value

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
    
    // Télécharger toutes les factures des commandes payées
    const downloadButtonInvoice = document.querySelector('.telecharge-factures-commandepayees');
    downloadButtonInvoice.addEventListener('click', function(){
        downloadAllPaidOrders("invoice")
    });
    
    // Télécharger toutes les factures des commandes payées
    const downloadButtonLabel = document.querySelector('.telecharge-etiquettes-commandepayees');
    downloadButtonLabel.addEventListener('click', function(){
        downloadAllPaidOrders("label")
    });


    async function downloadAllPaidOrders(type) {
        document.body.style.cursor = "wait";
        //console.log(type);
        const response = await fetch('http://localhost:8080/commandes/allPaidOrders/pn/'+type,{
        method:"GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
            });
            const fileBlob = await response.blob();
            const fileUrl = URL.createObjectURL(fileBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = fileUrl;
            downloadLink.download = type+'s.pdf';
            downloadLink.click();
            document.body.style.cursor = "auto";
    }

    async function updateOrder(data) {
        console.log(data);
        const updatedOrder = {
            data : [data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12],data[13],data[14],data[15],data[16]]
        };
        try {
            const response = await fetch('http://localhost:8080/commandes/updateOrder', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify(updatedOrder),
            });
            const data = await response.json();
            console.log(`Comment updated for order`);
        } catch (error) {
            console.error(`Error updating comment for order ${error}`);
        }
    }

    async function getDeliveryLabel(ref) {
        console.log("getDeliveryLabel "+ ref)
        try {
            const response = await fetch('http://localhost:8080/s3/downloadFile/delivery_label/'+ref, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
            });
            if(response.ok){
                const data = await response.blob();
                const url = URL.createObjectURL(data)

                window.open(url)
            }
            console.log(`Get delivery label from order`);
        } catch (error) {
            console.error(`Error updating comment for order ${error}`);
        }
    }
    async function getInvoice(ref) {
        console.log("getDeliveryLabel "+ ref)
        try {
            const response = await fetch('http://localhost:8080/s3/downloadFile/invoice/'+ref, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
            });
            if(response.ok){
                const data = await response.blob();
                const url = URL.createObjectURL(data)

                window.open(url)
            }
            console.log(`Get delivery label from order`);
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
        fetch('http://localhost:8080/commandes/getByEtat/' + initial(),{
            headers: {
                "authorization": token
            }})
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

    renderTableInvoice();

    async function renderTableInvoice() {
        fetch('http://localhost:8080/commandes/getByEtat/' + initial(),{
            headers: {
                "authorization": token
            }})
            .then(async res => {
                const data = await res.json();

                for (let i = 0; i < data.length; i++) {
                    let item = data[i];

                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${new Date(item[10]).toISOString().substring(0, 10)}</td>
                    <td class="showInvoiceInRenderTableInvoice" data-ref="${item[0]}">
                    <img src="../../tools/svg/download.svg" class="icon-svg-xl" alt="Facture" /> FACTURE
                    </td>
                    <td class="showLabelInRenderTableInvoice" data-ref="${item[0]}">
                    <img src="../../tools/svg/download.svg" class="icon-svg-xl" alt="Étiquette" /> ETIQUETTE
                    </td>
                    <td>${item[15]}</td>
                    `;
                    tableFacture.appendChild(row);
                }
                // Ajouter des écouteurs d'événements "click" aux éléments avec les classes "showInvoiceInRenderTableInvoice" et "showLabelInRenderTableInvoice"
                const showInvoiceButtons = document.querySelectorAll('.showInvoiceInRenderTableInvoice');
                showInvoiceButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        let ref = e.target.dataset.ref;
                        console.log(ref);
                        getInvoice('ref001')
                        //getInvoice(ref);
                        // TOCHANGE
                    });
                });
                
                const showLabelButtons = document.querySelectorAll('.showLabelInRenderTableInvoice');
                showLabelButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        let ref = e.target.dataset.ref;
                        console.log(ref);
                        //getDeliveryLabel(ref);
                        // TOCHANGE
                    });
                });
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
                'Content-Type': 'application/json',
                "authorization":token
            },
            body: JSON.stringify(body)
        })
            .then(async res => {
                const data = await res.json();
            })
    }
});

