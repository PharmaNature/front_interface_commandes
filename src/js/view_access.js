document.addEventListener('DOMContentLoaded', () => {
    // Sélectionnez tous les éléments avec la classe "content-request"
    const contentRequests = document.querySelectorAll('.content-one-access');
  
    // Parcours de tous les éléments et ajout d'un gestionnaire d'événement clic
    contentRequests.forEach(contentRequest => {
      contentRequest.addEventListener('click', () => {
        // Vérifie si la div est déjà sélectionnée
        const isSelected = contentRequest.classList.contains('selected');
  
        // Si elle est sélectionnée, supprimez la classe "selected", sinon ajoutez-la
        if (isSelected) {
          contentRequest.classList.remove('selected');
        } else {
          // Supprimez la classe "selected" de toutes les autres div
          contentRequests.forEach(element => {
            element.classList.remove('selected');
          });
  
          contentRequest.classList.add('selected');
        }
      });
    });
  });
  