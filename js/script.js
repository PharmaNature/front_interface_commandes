/*****************/
/* Hover & Click */
/*****************/
// onglets 
// Lorsque la souris passe sur un onglet
$('.onglets>*').on('mouseenter', function () {
    if (!$(this).hasClass('onglet_choisi')) {
        $(this).css('background-color', 'rgba(49, 87, 34, 0.26)'); // Change la couleur de fond de l'onglet en rouge
    }
});
// Lorsque la souris quitte un onglet
$('.onglets>*').on('mouseleave', function () {
    $(this).css('background-color', ''); // Rétablit la couleur de fond d'origine (vide)
});
$('.onglets>*').on('click', function () {
    $('.onglets>*').removeClass('onglet_choisi')
    $(this).addClass('onglet_choisi')
});



// Lorsque la souris passe sur un onglet
$('.menu_content>*').on('mouseenter', function () {
    if (!$(this).hasClass('menu_choisi')) {
        $(this).css('background-color', '#F2F2F2'); // Change la couleur de fond de l'onglet en rouge
    }
});
// Lorsque la souris quitte un onglet
$('.menu_content>*').on('mouseleave', function () {
    $(this).css('background-color', ''); // Rétablit la couleur de fond d'origine (vide)
});
$('.menu_content>*').on('click', function () {
    $('.menu_content>*').removeClass('menu_choisi')
    $(this).addClass('menu_choisi')
});


// Bande content 
$('.bande_content>*').on('mouseenter', function () {
    if (!$(this).hasClass('menu_choisi')) {
        $(this).css('background-color', '#F2F2F2'); // Change la couleur de fond de l'onglet en rouge
    }
});
// Lorsque la souris quitte un onglet
$('.bande_content>*').on('mouseleave', function () {
    $(this).css('background-color', ''); // Rétablit la couleur de fond d'origine (vide)
});



/**********/
/* Resize */
/**********/
// Content 
window.addEventListener('resize', function () {
    let div = $('.content');
    div.css({
        position: 'absolute',
        left: 0,
        width: $(window).innerWidth() * 0.999,
    });
});
let div = $('.content');
div.css({
    position: 'absolute',
    left: 0,
    width: $(window).innerWidth() * 0.999,
});



/*************/
/* Disappear */
/*************/


$('.bande_content>.views').on('click', function () {
    if ($('.menu_content').css('display') === 'none') {
        $('.menu_content').css('display', 'block')
    } else {
        $(".menu_content").css('display', 'none')
    }
});

$('.menu_content>.sdc').on('click', function () {
    $('.content3>*').css('display', 'none')
    $('.content3>.tableau_de_suivi').css('display', 'block')
});
$('.menu_content>.tds').on('click', function () {
    $('.content3>*').css('display', 'none')
    $('.content3>.suivie_des_commandes').css('display', 'flex')
});

$('.onglet_csipn').on('click', function (){
    $('.content>*').css('display','none')
    $('.content>.commandes_site_internet_pn').css('display','contents')
})
$('.onglet_fee').on('click', function (){
    $('.content>*').css('display','none')
    $('.content>.factures_et_etiquettes').css('display','contents')
}
)
$('.onglet_b').on('click', function (){
    $('.content>*').css('display','none')
    $('.content>.bordereaux').css('display','contents')
})
$('.onglet_cp').on('click', function (){
    $('.content>*').css('display','none')
    $('.content>.codes_promo').css('display','contents')
})



/****************/
/* Generate tab */
/****************/


var tableau = {
    tab_todo: {
        l1: {
            date: '24/4/2023',
            factures: './data/invoice/l1.png',
            etiquettes: './data/label/l1.png',
            comment: ''
        }
    },
    tab_done: {
        l1: {
            date: '25/4/2023',
            factures: './data/invoice/l1.png',
            etiquettes: './data/label/l1.png',
            comment: ''
        },
        l2: {
            date: '26/4/2023',
            factures: './data/invoice/l1.png',
            etiquettes: './data/label/l1.png',
            comment: ''
        },
        l3: {
            date: '27/4/2023',
            factures: './data/invoice/l1.png',
            etiquettes: './data/label/l1.png',
            comment: ''
        },
        l4: {
            date: '28/4/2023',
            factures: './data/invoice/l1.png',
            etiquettes: './data/label/l1.png',
            comment: ''
        }
    }
}
generateTab(tableau)

function generateTab(tableau) {
    // Créer la table
    var table = $(".tableau_de_suivi");

    // Créer les en-têtes de colonne
    var headers = $("<tr></tr>").append(
        $("<th></th>").text("Etat des tâches")
    );
    var headerNames = ["Date", "Factures", "Étiquettes", "Commentaire"];
    $.each(headerNames, function (index, headerName) {
        headers.append($("<th></th>").text(headerName));
    });
    table.append(headers);

    // Ajouter les données
    $.each(tableau, function (key, section) {
        var etat = "";
        var classe = "";
        if (key == "tab_todo") {
            etat = "Traité";
            classe = "taskDone";
        } else {
            etat = "A Faire";
            classe = "taskToDo";
        }
        $.each(section, function (subKey, item) {
            var columns = [item.date, item.factures, item.etiquettes, item.comment];
            var row = $("<tr></tr>").append(
                $("<td></td>").text(etat).addClass(classe)
            );
            $.each(columns, function (index, columnText) {
                row.append($("<td></td>").text(columnText));
            });
            table.append(row);
        });
    });

    // Ajouter la table au document
    var container = $("#table-container");
    container.empty().append(table);
}

/*****************/
/* Drag and Drop */
/*****************/

$(document).ready(function () {
    // Écouteurs d'événements pour les éléments ".item"
    $('.item').on('dragstart', handleDragStart);
    $('.item').on('dragover', handleDragOver);
    $('.item').on('drop', handleDrop);

    // Écouteurs d'événements pour les éléments ".column"
    $('.column').on('dragover', handleDragOver);
    $('.column').on('drop', handleDrop);

    // Fonction pour gérer le début du déplacement de l'élément
    function handleDragStart(event) {
        event.originalEvent.dataTransfer.setData('text/plain', event.target.id);
    }

    // Fonction pour gérer le survol de l'élément
    function handleDragOver(event) {
        event.preventDefault();
    }

    // Fonction pour gérer le dépôt de l'élément
    function handleDrop(event) {
        event.preventDefault();
        const data = event.originalEvent.dataTransfer.getData('text/plain');
        const $target = $(event.target);

        // Si l'élément de destination est une colonne, on y ajoute l'élément déplacé
        if ($target.hasClass('column')) {
            $target.append($('#' + data));
        }
        // Sinon, on ajoute l'élément déplacé à la colonne parente de l'élément de destination
        else if ($target.parent().hasClass('column')) {
            $target.parent().append($('#' + data));
        }
    }
});