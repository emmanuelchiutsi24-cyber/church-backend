import requests

base = 'http://localhost:8080'

reg = requests.post(base + '/api/auth/register', json={
    'username': 'parishadmin_20261106',
    'password': 'Pass12345',
    'parishName': 'St. Theresa (Seke)'
})
print('REGISTER', reg.status_code, reg.text)

sys_login = requests.post(base + '/api/auth/login', json={
    'username': 'mjsysadmin',
    'password': 'MasterSecret2026!'
})
sys_login.raise_for_status()
token = sys_login.json()['token']

pending = requests.get(base + '/api/auth/pending', headers={'Authorization': 'Bearer ' + token})
print('PENDING', pending.status_code, pending.text)

pending_list = pending.json()
target = next((x for x in pending_list if x['username'] == 'parishadmin_20261106'), None)
print('TARGET', target)
if not target:
    raise SystemExit('No pending account found')

approved = requests.put(base + f"/api/auth/approve/{target['id']}", headers={'Authorization': 'Bearer ' + token})
print('APPROVE', approved.status_code, approved.text)

admin_login = requests.post(base + '/api/auth/login', json={
    'username': 'parishadmin_20261106',
    'password': 'Pass12345'
})
print('ADMINLOGIN', admin_login.status_code, admin_login.text)
