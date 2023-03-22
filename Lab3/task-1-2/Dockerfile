# Вибір базового образу
FROM nginx:latest

# Встановлення додаткових системних пакетів
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    vim

# Додавання кастомізованих ярликів (LABEL)
LABEL maintainer="KPI_ITC_@gmail.com" \
      version="1.0" \
      description="Custom Nginx container"

# Виводити актуальну дату та час під час запуску (ENTRYPOINT)
ENTRYPOINT ["sh", "-c", "echo 'Актуальна дата та час: $(date)' && exec nginx -g 'daemon off;'"]

# Додати до нього том (Volume) та примонтуваши до контейнеру директорію з хост-машини
VOLUME /test-dir