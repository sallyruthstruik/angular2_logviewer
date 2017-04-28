FROM python:3.5-alpine
WORKDIR /app/
COPY package.json .
RUN apk add nodejs --update && \
    npm install -g typescript concurrently gulp && \
    npm install
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN python setup.py develop
RUN gulp dist
EXPOSE 80
CMD ["python", "mongo_logviewer/logviewer.py", "--bind", "0.0.0.0:80"]
