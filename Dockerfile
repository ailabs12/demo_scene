FROM python:3.6-alpine

WORKDIR /home/demo_scene
COPY . .

RUN apk add --no-cache --virtual .build-deps gcc musl-dev
RUN pip install -U setuptools && pip install -r requirements.txt
RUN apk del .build-deps gcc musl-dev

# ENV FLASK_APP main.py
# EXPOSE 8002
CMD ["gunicorn", "-w 4", "-b :5000", "--access-logfile", "-", "--error-logfile", "-", "main:app"]