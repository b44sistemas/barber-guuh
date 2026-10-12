# 💈 BvIt Barber Club - Aplicativo Mobile & PWA Completo para Barbearia

Aplicativo completo de agendamento online para barbearias, desenvolvido com foco **Mobile-First** e suporte nativo a **PWA (Progressive Web App)**, permitindo instalação direta na tela inicial de qualquer smartphone Android ou iPhone sem precisar de App Store/Google Play.

---

## 🚀 Principais Funcionalidades

### 📱 Experiência do Cliente (Mobile / PWA)
- **Agendamento em 4 Passos (Wizard Intuitivo):**
  1. **Escolha do Serviço:** Cortes modernos, fade/degradê, barba terapia com toalha quente, combos, selagem, pigmentação.
  2. **Escolha do Barbeiro:** Foto do profissional, especialidades, avaliações ou opção "Primeiro Barbeiro Disponível".
  3. **Data & Horários Livres:** Cálculo dinâmico em tempo real de horários livres, sem risco de conflito ou agendamento duplo.
  4. **Confirmação & WhatsApp:** Resumo de valores e envio de mensagem pré-formatada para o WhatsApp da barbearia.
- **Meus Horários:** Consulta rápida por WhatsApp para visualizar agendamentos ativos, histórico e cancelamento de horários.
- **A Barbearia:** Fotos da equipe, endereço com botão para abrir no Google Maps, horários de funcionamento e contato.

### 🛡️ Painel de Gestão do Dono / Barbeiro (Área Administrativa)
- **Dashboard com Métricas em Tempo Real:**
  - Total de agendamentos do dia e quantidade de concluídos.
  - Faturamento estimado do dia (R$).
  - Total de agendamentos e faturamento acumulado do mês.
- **Agenda do Dia Interativa:**
  - Filtro por data e barbeiro.
  - Botão de **Concluir Atendimento** e **Cancelar**.
  - Botão **Chamar Zap** que abre o WhatsApp do cliente com mensagem pré-preenchida confirmando o horário.
- **Gestão de Barbeiros & Serviços:**
  - Cadastro de novos serviços, preços e durações em minutos.
  - Controle de barbeiros ativos na equipe.

---

## 📂 Estrutura do Projeto

```text
barber-app/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # Conexão MongoDB com Mongoose
│   │   ├── middleware/           # Proteção JWT e perfil de Admin
│   │   ├── models/               # Schemas: User, Barber, Service, Appointment, Setting
│   │   ├── routes/               # Endpoints REST: auth, barbers, services, appointments, admin
│   │   ├── seeds/seedData.js     # População automática do banco com barbeiros e serviços iniciais
│   │   └── server.js             # Ponto de entrada Express
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── css/custom.css            # Estilos escuros premium, glassmorphism e mobile safe areas
│   ├── js/
│   │   ├── app.js                # Lógica do cliente, cálculo de horários e agendamentos
│   │   └── admin.js              # Lógica do painel de administração e métricas
│   ├── public/
│   │   ├── icon.svg              # Ícone vetorial da barbearia
│   │   ├── icon-192.png          # Ícone 192x192 para PWA
│   │   ├── icon-512.png          # Ícone 512x512 para PWA
│   │   └── manifest.json         # Manifest de instalação do PWA
│   ├── Dockerfile                # Nginx Alpine leve
│   ├── nginx.conf                # Configuração Nginx com roteamento SPA e cache
│   ├── index.html                # Interface mobile moderna
│   └── sw.js                     # Service Worker PWA com cache e offline
├── docker-compose.yml            # Orquestração para a VPS
├── .env.example
├── preview_server.py             # Servidor Python para teste local no Windows
└── README.md
```

---

## 💻 Como Testar Localmente no Windows (Sem Instalar Nada)

Você pode testar a interface completa e todas as telas no seu computador agora mesmo rodando o servidor de pré-visualização em Python:

1. Abra o terminal na pasta do projeto:
   ```powershell
   cd C:\Users\ygors\.gemini\antigravity\scratch\barber-app
   python preview_server.py
   ```
2. Abra seu navegador no endereço:
   ```text
   http://localhost:8080
   ```
3. **Dica:** No navegador, pressione `F12` e clique no ícone de celular (**Toggle Device Toolbar**) para ver a experiência mobile perfeita.

---

## 🌐 Deploy na sua VPS (169.58.19.211)

### 1. Copiar o projeto para a VPS
Envie os arquivos para a sua pasta na VPS (ex: `/home/admygor/barber`):

```bash
mkdir -p /home/admygor/barber
cd /home/admygor/barber
```

### 2. Subir os Containers com Docker
O `docker-compose.yml` já está configurado exatamente para usar as redes existentes da sua VPS (`shared-network` e `web`) e conectar no banco `banco-mongodb`:

```bash
docker compose up -d --build
```

Os dois containers serão iniciados:
- `barber-api` (Porta 5000 interna na rede `shared-network` e `web`)
- `barber-web` (Porta 80 interna na rede `web`)

### 3. Configurar o Caddyfile da VPS
Abra o arquivo `/home/admygor/caddy/Caddyfile` e adicione o bloco do domínio `barberguuh.bvitsystem.com.br`:

```caddy
barberguuh.bvitsystem.com.br {
    handle /api/* {
        reverse_proxy barber-api:5000
    }
    handle {
        reverse_proxy barber-web:80
    }
}
```

Recarregue o Caddy:
```bash
docker exec -w /etc/caddy caddy caddy reload
# ou
caddy reload
```

---

## 📲 Como Instalar o PWA no Celular

- **Android (Chrome):**
  Acesse `https://barberguuh.bvitsystem.com.br` > menu dos 3 pontinhos > **"Instalar aplicativo"** ou **"Adicionar à Tela Inicial"**.
- **iPhone (Safari):**
  Acesse pelo Safari > Compartilhar > **"Adicionar à Tela de Início"**. O app funcionará em tela cheia suave como um app nativo!
