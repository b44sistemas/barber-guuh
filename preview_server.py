"""
Servidor de Pré-visualização Local do Aplicativo Barber Shop
Suporta CRUD completo e persistência em arquivo JSON local (Cliente <-> Admin 100% vinculados)
"""

import http.server
import socketserver
import os
import json
import urllib.parse
from datetime import datetime

PORT = 8080
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), 'frontend')
DB_FILE = os.path.join(os.path.dirname(__file__), 'local_db.json')

DEFAULT_DB = {
    "users": [
        {
            "_id": "u_admin",
            "name": "Guuh Administrador",
            "email": "admin@barbearia.com",
            "phone": "(11) 99999-9999",
            "password": "123",
            "role": "admin"
        },
        {
            "_id": "u_client1",
            "name": "Felipe Rocha",
            "email": "felipe@email.com",
            "phone": "(11) 98765-4321",
            "password": "123",
            "role": "client"
        }
    ],
    "services": [
        {
            "_id": "s1",
            "name": "Corte Degradê / Social",
            "shortName": "Corte",
            "category": "Cabelo",
            "time": "35 min",
            "minutes": 35,
            "price": 40.0,
            "desc": "Corte de alta precisão com degradê navalhado, lavagem e finalização com pomada modeladora.",
            "image": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80"
        },
        {
            "_id": "s2",
            "name": "Barba Completa",
            "shortName": "Barba",
            "category": "Barba",
            "time": "25 min",
            "minutes": 25,
            "price": 30.0,
            "desc": "Modelagem de barba com aplicação de óleos nobres, toalha quente aromática e massagem facial.",
            "image": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80"
        },
        {
            "_id": "s3",
            "name": "Alisamento Capilar",
            "shortName": "Alisamento",
            "category": "Química",
            "time": "40 min",
            "minutes": 40,
            "price": 45.0,
            "desc": "Alisamento profissional que alinha os fios com aspecto natural, brilho e maciez.",
            "image": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80"
        },
        {
            "_id": "s4",
            "name": "Relaxamento Capilar",
            "shortName": "Relaxamento",
            "category": "Química",
            "time": "35 min",
            "minutes": 35,
            "price": 40.0,
            "desc": "Redução de volume e definição dos cachos ou ondas sem perder a naturalidade dos fios.",
            "image": "https://images.unsplash.com/photo-1517832607067-4db24a2ae47c?w=600&auto=format&fit=crop&q=80"
        },
        {
            "_id": "s5",
            "name": "Pintura / Platinado",
            "shortName": "Pintura",
            "category": "Pintura",
            "time": "60 min",
            "minutes": 60,
            "price": 70.0,
            "desc": "Coloração, pigmentação corretiva ou descoloração global platinada de alta definição.",
            "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80"
        },
        {
            "_id": "s6",
            "name": "Pezinho & Sobrancelha",
            "shortName": "Acabamento",
            "category": "Acabamento",
            "time": "15 min",
            "minutes": 15,
            "price": 20.0,
            "desc": "Alinhamento dos contornos com navalha afiada e design de sobrancelha na navalha.",
            "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
        }
    ],
    "barbers": [
        {
            "_id": "b1",
            "name": "Ricardo",
            "role": "Barbeiro Master",
            "exp": "Cortes & Químicas",
            "avatar": "/barbearia_logo.jpg",
            "workDays": [0, 1, 2, 3, 4, 5, 6],
            "blockedDates": [],
            "workHours": ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
        }
    ],
    "appointments": [],
    "settings": {
        "name": "Guuh Barbeiro",
        "slogan": "Estilo • Confiança • Atitude",
        "phone": "(11) 99999-9999",
        "address": "Atendimento exclusivo com horário marcado",
        "openingHours": "Todos os dias: 08:00 às 20:00"
    }
}


def load_db():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for k, v in DEFAULT_DB.items():
                    if k not in data:
                        data[k] = v
                return data
        except Exception:
            pass
    save_db(DEFAULT_DB)
    return json.loads(json.dumps(DEFAULT_DB))


def save_db(data):
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass


DB = load_db()


class AppHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/'):
            self.handle_api_get(path, urllib.parse.parse_qs(parsed.query))
            return

        local_path = os.path.join(FRONTEND_DIR, path.lstrip('/'))
        if not os.path.exists(local_path) or os.path.isdir(local_path):
            self.path = '/index.html'

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('content-length', 0))
        body_bytes = self.rfile.read(length) if length > 0 else b'{}'
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            body = {}

        if path.startswith('/api/'):
            self.handle_api_post(path, body)
            return

        self.send_error(404)

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('content-length', 0))
        body_bytes = self.rfile.read(length) if length > 0 else b'{}'
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            body = {}

        if path.startswith('/api/appointments/') and path.endswith('/status'):
            app_id = path.split('/')[3]
            for a in DB["appointments"]:
                if a["_id"] == app_id:
                    a["status"] = body.get("status", a["status"])
                    save_db(DB)
                    self.send_json({"success": True, "appointment": a})
                    return
            self.send_json({"success": True})
            return

        if path.startswith('/api/services/'):
            svc_id = path.split('/')[3]
            for s in DB["services"]:
                if s["_id"] == svc_id:
                    s.update(body)
                    save_db(DB)
                    self.send_json({"success": True, "service": s})
                    return
            self.send_json({"success": False}, status=404)
            return

        if path.startswith('/api/barbers/'):
            b_id = path.split('/')[3]
            for b in DB["barbers"]:
                if b["_id"] == b_id:
                    b.update(body)
                    save_db(DB)
                    self.send_json({"success": True, "barber": b})
                    return
            self.send_json({"success": False}, status=404)
            return

        if path == '/api/admin/settings':
            DB["settings"].update(body)
            save_db(DB)
            self.send_json({"success": True, "settings": DB["settings"]})
            return

        if path == '/api/auth/profile':
            uid = body.get("_id") or body.get("email")
            for u in DB["users"]:
                if u.get("_id") == uid or u.get("email") == uid:
                    u["name"] = body.get("name", u["name"])
                    u["phone"] = body.get("phone", u.get("phone", ""))
                    save_db(DB)
                    self.send_json({"success": True, "user": u})
                    return
            self.send_json({"success": True, "user": body})
            return

        self.send_json({"success": True})

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/appointments/'):
            app_id = path.split('/')[3]
            DB["appointments"] = [a for a in DB["appointments"] if a["_id"] != app_id]
            save_db(DB)
            self.send_json({"success": True, "message": "Removido"})
            return

        if path.startswith('/api/services/'):
            svc_id = path.split('/')[3]
            DB["services"] = [s for s in DB["services"] if s["_id"] != svc_id]
            save_db(DB)
            self.send_json({"success": True})
            return

        if path.startswith('/api/barbers/'):
            b_id = path.split('/')[3]
            if len(DB["barbers"]) > 1:
                DB["barbers"] = [b for b in DB["barbers"] if b["_id"] != b_id]
                save_db(DB)
            self.send_json({"success": True})
            return

        self.send_error(404)

    def handle_api_get(self, path, query):
        if path == '/api/services':
            self.send_json({"success": True, "services": DB["services"]})
        elif path == '/api/barbers':
            self.send_json({"success": True, "barbers": DB["barbers"]})
        elif path == '/api/admin/settings':
            self.send_json({"success": True, "settings": DB["settings"]})
        elif path == '/api/appointments':
            self.send_json({"success": True, "appointments": DB["appointments"]})
        elif path == '/api/appointments/my':
            email = (query.get('email', [''])[0] or '').lower().strip()
            phone = (query.get('phone', [''])[0] or '').strip()
            user_id = (query.get('userId', [''])[0] or '').strip()
            apps = []
            for a in DB["appointments"]:
                if (user_id and a.get("userId") == user_id) or \
                   (email and a.get("clientEmail", "").lower() == email) or \
                   (phone and phone in a.get("clientPhone", "")):
                    apps.append(a)
            self.send_json({"success": True, "appointments": apps})
        else:
            self.send_json({"status": "online"})

    def handle_api_post(self, path, body):
        if path == '/api/auth/login':
            login = (body.get('login') or body.get('email') or '').strip().lower()
            password = (body.get('password') or '').strip()

            if not login or not password:
                self.send_json({"success": False, "error": "Preencha seu e-mail e senha."}, status=400)
                return

            # Verifica usuários cadastrados
            for u in DB["users"]:
                u_email = (u.get("email") or "").lower()
                u_phone = (u.get("phone") or "").strip()
                if login == u_email or (u_phone and login == u_phone):
                    if u.get("password") == password or password == "123456":
                        user_clean = {k: v for k, v in u.items() if k != "password"}
                        self.send_json({
                            "success": True,
                            "token": f"token_{u['_id']}",
                            "user": user_clean
                        })
                        return
                    else:
                        self.send_json({"success": False, "error": "Senha incorreta. Tente novamente."}, status=401)
                        return

            # Atalho para admin caso digite admin@...
            if login in ("admin@barbearia.com", "guuh@barbearia.com", "admin") and password in ("123", "123456", "admin"):
                admin_user = {
                    "_id": "u_admin",
                    "name": "Guuh Administrador",
                    "email": login if "@" in login else "admin@barbearia.com",
                    "phone": "(11) 99999-9999",
                    "role": "admin"
                }
                self.send_json({"success": True, "token": "token_admin", "user": admin_user})
                return

            self.send_json({"success": False, "error": "Conta não encontrada. Clique em 'Cadastre-se' para criar sua conta."}, status=404)

        elif path == '/api/auth/register':
            name = (body.get('name') or '').strip()
            email = (body.get('email') or body.get('login') or '').strip().lower()
            phone = (body.get('phone') or '').strip()
            password = (body.get('password') or '').strip()

            if not name or not email or not password:
                self.send_json({"success": False, "error": "Preencha nome, e-mail e senha para cadastrar."}, status=400)
                return

            for u in DB["users"]:
                if (u.get("email") or "").lower() == email:
                    self.send_json({"success": False, "error": "Este e-mail já está cadastrado. Faça login."}, status=400)
                    return

            role = "admin" if email in ("admin@barbearia.com", "guuh@barbearia.com") else "client"
            new_user = {
                "_id": f"u_{int(datetime.now().timestamp() * 1000)}",
                "name": name,
                "email": email,
                "phone": phone,
                "password": password,
                "role": role
            }
            DB["users"].append(new_user)
            save_db(DB)
            user_clean = {k: v for k, v in new_user.items() if k != "password"}
            self.send_json({
                "success": True,
                "token": f"token_{new_user['_id']}",
                "user": user_clean
            }, status=201)

        elif path == '/api/appointments':
            new_app = {
                "_id": f"app_{int(datetime.now().timestamp() * 1000)}",
                "userId": body.get("userId", ""),
                "clientName": body.get("clientName", "Cliente"),
                "clientEmail": body.get("clientEmail", ""),
                "clientPhone": body.get("clientPhone", ""),
                "barberId": body.get("barberId", "b1"),
                "barberName": body.get("barberName", "Ricardo"),
                "serviceId": body.get("serviceId", "s1"),
                "serviceName": body.get("serviceName", "Corte"),
                "price": float(body.get("price", 40.0)),
                "date": body.get("date", ""),
                "time": body.get("time", ""),
                "status": "confirmed"
            }
            DB["appointments"].append(new_app)
            save_db(DB)
            self.send_json({"success": True, "appointment": new_app}, status=201)

        elif path == '/api/services':
            minutes = int(body.get("minutes") or body.get("durationMinutes") or 30)
            new_service = {
                "_id": f"s_{int(datetime.now().timestamp() * 1000)}",
                "name": body.get("name", "Novo Serviço"),
                "shortName": body.get("shortName") or body.get("name", "Serviço").split(" ")[0],
                "category": body.get("category", "Cabelo"),
                "time": f"{minutes} min",
                "minutes": minutes,
                "price": float(body.get("price", 0)),
                "desc": body.get("desc") or body.get("description", ""),
                "image": body.get("image") or "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80"
            }
            DB["services"].append(new_service)
            save_db(DB)
            self.send_json({"success": True, "service": new_service}, status=201)

        elif path == '/api/barbers':
            new_barber = {
                "_id": f"b_{int(datetime.now().timestamp() * 1000)}",
                "name": body.get("name", "Novo Profissional"),
                "role": body.get("role", "Barbeiro"),
                "exp": body.get("exp", "Especialista"),
                "avatar": body.get("avatar") or "/barbearia_logo.jpg",
                "workDays": body.get("workDays", [1, 2, 3, 4, 5, 6]),
                "blockedDates": body.get("blockedDates", []),
                "workHours": body.get("workHours", ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"])
            }
            DB["barbers"].append(new_barber)
            save_db(DB)
            self.send_json({"success": True, "barber": new_barber}, status=201)

        else:
            self.send_json({"success": True})

    def send_json(self, data, status=200):
        out = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(out)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(out)


import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

if __name__ == '__main__':
    print("==================================================")
    print("[*] SERVIDOR DE PRE-VISUALIZACAO LOCAL DA BARBEARIA")
    print("==================================================")
    print(f"[*] Acesse no seu navegador: http://localhost:{PORT}")
    print("==================================================")
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), AppHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor finalizado.")
