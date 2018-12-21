import os
import requests
import base64
from datetime import datetime
from requests import post

from flask import render_template, request, json, redirect

from app import app

_HOST = 'http://82.202.249.143'


_SERVICES = {
    'emotion_classifier': f'{_HOST}:8000/emotion_classificator/1.0',
    'gender_classifier': f'{_HOST}:8000/gender_classificator/1.0',
    'age_classifier': f'{_HOST}:8000/age_classificator/1.0',
    'car_classifier': f'{_HOST}:8001/car_classifier'
}


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/parser', methods=['POST'])
def parser():
    print(request.json)
    headers = {'Content-type': 'application/json'}
    params = {
        'image': request.form['base64']
    }
    # img_b64 = request.form['base64']
    service = request.form['service']
    if service in _SERVICES:
        start = datetime.now()
        response = post(_SERVICES[service], headers=headers, json=params)
        end = datetime.now() - start
        response = json.loads(response.text)
        response['latency'] = f'{int(end.total_seconds() * 1000.0)} ms'
    # post_req = set_request()
        return json.jsonify(response)
    else:
        return json.jsonify({'error': 'server not found'})


@app.route('/results', methods=['GET'])
def results():
    return render_template('results.html')


@app.route('/parseURL', methods=['POST'])
def parse_url():
    if request.method == 'POST':
        url = request.json['url']
        r = requests.get(url)
        img_base64 = base64.b64encode(r.content).decode()
        img_base64 = 'data:image/jpeg;base64,' + img_base64
        return img_base64
    else:
        return redirect('/')

