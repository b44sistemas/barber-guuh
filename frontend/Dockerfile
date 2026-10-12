FROM nginx:alpine

# Remove página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia configuração customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia arquivos estáticos do frontend
COPY . /usr/share/nginx/html

# Remove arquivos de configuração desnecessários do diretório servido
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
