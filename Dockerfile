# Utiliser une image légère Nginx
FROM nginx:1.21-alpine

# Copier les fichiers d'application vers le répertoire de base Nginx
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]