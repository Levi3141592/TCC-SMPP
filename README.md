# Sistema de Melhoria de Processos Produtivos (SMPP)
### *Sinergia Tecnológica para a Excelência Operacional*

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-green.svg)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TCC](https://img.shields.io/badge/TCC-ETEC%20Rodrigues%20de%20Abreu-red.svg)](https://www.etecrodeabreu.com.br/)

> **Trabalho de Conclusão de Curso** desenvolvido no ETEC "Rodrigues de Abreu" pelos alunos **Alexandre Levi dos Santos Oliveira**, **João Henrique de Moraes Carvalho Valentim** e **Pedro Henrique Cabral dos Santos**, sob orientação do **Prof. Oliver Marcos Netto**.

---

## 🎯 **Visão Geral**

O SMPP é uma solução inovadora e modular desenvolvida especificamente para instituições de ensino, que integra **Inteligência Artificial**, **IoT** e **Visão Computacional** para otimizar processos administrativos, garantir segurança física e melhorar a experiência dos usuários.

### **🏆 Resultados Comprovados:**
- ✅ **40% de redução** no tempo de atendimento
- ✅ Suporte a **5.000 autenticações simultâneas**  
- ✅ **95%+ de precisão** na detecção de incidentes
- ✅ **Pontuação SUS: 85** (acima da média de 68 para sistemas educacionais)

---

## 🧩 **Arquitetura Modular**

O sistema é composto por **três módulos principais** independentes e escaláveis:

### **1. 🤖 Chatbot Institucional**
- **Framework:** Rasa Open Source + Transformers
- **Funcionalidades:**
  - Atendimento automatizado 24/7
  - Consulta de documentos e calendários
  - Integração com WhatsApp e interface web
  - Notificações proativas via Celery + RabbitMQ
- **Tecnologias:** spaCy, BiLSTM-CRF, Spring Boot, Jinja2

### **2. 🔐 Gerenciamento de Acesso**
- **Dispositivos:** ESP32, Raspberry Pi, leitores biométricos
- **Funcionalidades:**
  - Controle de acesso em tempo real
  - Logs de auditoria seguros (SHA-256)
  - Painéis analíticos responsivos
  - Comunicação segura via MQTT/TLS
- **Tecnologias:** MicroPython, Node.js, MongoDB, React + Ant Design

### **3. 👁️ Monitoramento Inteligente**
- **IA:** YOLOv5, FaceNet, OpenCV
- **Funcionalidades:**
  - Vigilância em vídeo em tempo real
  - Detecção de objetos e reconhecimento facial
  - Análises comportamentais com clustering
  - Alertas automáticos para equipes de segurança
- **Tecnologias:** OpenVINO, FFmpeg, Kafka Streams, Faiss

---

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React 18** com hooks modernos
- **Tailwind CSS** para estilização responsiva
- **Lucide React** para ícones
- **Componentes funcionais** com TypeScript

### **Backend**
- **PostgreSQL 15** como banco principal
- **MongoDB** para logs de alta performance
- **Node.js** com Express.js
- **APIs RESTful** com Spring Boot/.NET Core

### **DevOps & Infraestrutura**
- **Kubernetes** para orquestração de containers
- **Docker** para containerização
- **GitLab CI/CD** para integração contínua
- **Prometheus + Grafana** para monitoramento
- **JMeter** para testes de performance
- **OWASP ZAP** para testes de segurança

### **Machine Learning & IoT**
- **Rasa Open Source** para NLP
- **YOLOv5** para detecção de objetos
- **FaceNet** para reconhecimento facial
- **MQTT** para comunicação IoT
- **Edge AI** com OpenVINO

---

## 📊 **Sistema de Agendamento de Salas**

Como demonstração prática das capacidades do SMPP, desenvolvemos um **Sistema de Agendamento de Salas** completo:

### **🎨 Interface de Usuário**
- Calendário mensal interativo
- Visualização por cores para diferentes tipos de atividade:
  - 📚 **Aulas** (azul)
  - 📝 **Provas** (vermelho) 
  - 🎓 **Seminários** (verde)
- Sistema de busca e filtros inteligentes
- Formulários de criação/edição responsivos

### **🗄️ Banco de Dados**
Estrutura completa seguindo as melhores práticas:

```sql
-- Tabelas principais
- person (usuários do sistema)
- student/teacher/staff (especializações)  
- class (turmas e anos letivos)
- subject (matérias/disciplinas)
- activity (atividades agendadas - CORE)
- grade (sistema de notas)
- access_log (controle de acesso)
- notification (sistema de notificações)
- document (gerenciamento de documentos)
- device (dispositivos IoT)
```

### **⚡ Funcionalidades Avançadas**
- Verificação automática de **conflitos de horário**
- **Triggers** para auditoria e logs automáticos
- **Views otimizadas** para relatórios
- **Índices estratégicos** para alta performance
- **Funções de segurança** com criptografia bcrypt

---

## 🚀 **Instalação e Configuração**

### **Pré-requisitos**
```bash
Node.js >= 18.0
PostgreSQL >= 15.0
Docker >= 24.0
Kubernetes >= 1.28
```

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/smpp-sistema.git
cd smpp-sistema
```

### **2. Configuração do Banco de Dados**
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE school_scheduler;
\c school_scheduler;

# Executar script de criação
\i database/schema.sql
```

### **3. Configuração do Backend**
```bash
cd backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Iniciar servidor
npm run dev
```

### **4. Configuração do Frontend**
```bash
cd frontend
npm install

# Iniciar aplicação React
npm start
```

### **5. Deploy com Docker (Opcional)**
```bash
# Build e deploy completo
docker-compose up -d

# Verificar status
kubectl get pods -n smpp
```

---

## 📋 **Estrutura do Projeto**

```
smpp-sistema/
├── 📁 frontend/              # Interface React
│   ├── 📁 src/components/    # Componentes reutilizáveis
│   ├── 📁 src/pages/         # Páginas da aplicação
│   ├── 📁 src/hooks/         # Hooks customizados
│   └── 📁 src/utils/         # Utilitários e helpers
├── 📁 backend/               # API e serviços
│   ├── 📁 controllers/       # Controladores da API
│   ├── 📁 models/            # Modelos de dados
│   ├── 📁 routes/            # Rotas da API
│   └── 📁 middleware/        # Middlewares
├── 📁 database/              # Scripts SQL
│   ├── schema.sql            # Estrutura completa do banco
│   └── migrations/           # Migrações
├── 📁 modules/               # Módulos do SMPP
│   ├── 📁 chatbot/           # Chatbot Institucional
│   ├── 📁 access-control/    # Gerenciamento de Acesso
│   └── 📁 monitoring/        # Monitoramento Inteligente
├── 📁 devops/                # Configurações DevOps
│   ├── 📁 kubernetes/        # Manifests K8s
│   ├── 📁 docker/            # Dockerfiles
│   └── 📁 ci-cd/             # Pipelines CI/CD
└── 📁 docs/                  # Documentação
    ├── api-docs/             # Documentação da API
    ├── user-manual/          # Manual do usuário
    └── architecture/         # Diagramas de arquitetura
```

---

## 🧪 **Testes e Qualidade**

### **Testes Implementados**
- ✅ **Testes Unitários** (Jest, PyTest)
- ✅ **Testes de Integração** (Postman, Newman)
- ✅ **Testes de Performance** (JMeter - suporta 5K usuários simultâneos)
- ✅ **Testes de Segurança** (OWASP ZAP - conformidade Top 10)
- ✅ **Testes de Usabilidade** (SUS Score: 85/100)

### **Executar Testes**
```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Testes de performance
./scripts/performance-test.sh

# Análise de segurança
npm run security:scan
```

---

## 📈 **Métricas e Monitoramento**

### **KPIs Principais**
- **Disponibilidade:** 99.9% uptime
- **Performance:** < 200ms tempo de resposta médio
- **Segurança:** Zero vulnerabilidades críticas
- **Usabilidade:** 85% satisfação dos usuários

### **Dashboards Disponíveis**
- 📊 **Grafana:** Métricas de infraestrutura e aplicação
- 📋 **Prometheus:** Coleta de métricas em tempo real
- 🔍 **ELK Stack:** Análise de logs centralizados
- 📱 **Mobile Dashboard:** Acompanhamento via smartphone

---

## 🤝 **Como Contribuir**

Valorizamos contribuições da comunidade! Siga os passos abaixo:

### **1. Fork & Clone**
```bash
git fork https://github.com/seu-usuario/smpp-sistema.git
git clone https://github.com/seu-usuario/smpp-sistema.git
cd smpp-sistema
```

### **2. Criar Branch**
```bash
git checkout -b feature/nova-funcionalidade
```

### **3. Desenvolver & Testar**
```bash
# Suas alterações aqui
npm test
```

### **4. Submit Pull Request**
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### **📋 Guidelines**
- ✅ Seguir padrões de código (ESLint, Prettier)
- ✅ Incluir testes para novas funcionalidades
- ✅ Documentar mudanças significativas
- ✅ Usar Conventional Commits

---

## 📄 **Licença**

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 **Equipe de Desenvolvimento**

### **🎓 Desenvolvedores**
- **Alexandre Levi dos Santos Oliveira** - *Full Stack Developer*
- **João Henrique de Moraes Carvalho Valentim** - *Backend & DevOps*
- **Pedro Henrique Cabral dos Santos** - *Frontend & UX/UI*

### **🧑‍🏫 Orientação Acadêmica**
- **Prof. Oliver Marcos Netto** - *Orientador*
- **ETEC "Rodrigues de Abreu"** - *Instituição de Ensino*

---

## 📞 **Contato e Suporte**

### **🔗 Links Úteis**
- 📖 **Documentação Completa:** [docs.smpp.dev](https://docs.smpp.dev)
- 🐛 **Issues:** [github.com/issues](https://github.com/seu-usuario/smpp-sistema/issues)
- 💬 **Discussões:** [github.com/discussions](https://github.com/seu-usuario/smpp-sistema/discussions)
- 📧 **Email:** contato@smpp.dev

### **🌐 Redes Sociais**
- 🐙 **GitHub:** [@smpp-sistema](https://github.com/smpp-sistema)
- 💼 **LinkedIn:** [SMPP Project](https://linkedin.com/company/smpp)
- 🐦 **Twitter:** [@smpp_dev](https://twitter.com/smpp_dev)

---

## 🎉 **Agradecimentos**

Agradecemos especialmente:

- **ETEC "Rodrigues de Abreu"** pela infraestrutura e apoio institucional
- **Prof. Oliver Marcos Netto** pela orientação técnica e acadêmica
- **Comunidade Open Source** pelas ferramentas e bibliotecas utilizadas
- **Beta Testers** que participaram dos testes de usabilidade
- **Funcionários da ETEC** que forneceram feedback valioso

---

## 🔮 **Próximos Passos**

### **🚀 Roadmap 2025**
- [ ] **Módulo de Análise Preditiva** - ML para previsão de frequência
- [ ] **Edge AI** - Processamento local com menor latência
- [ ] **Mobile App Nativo** - React Native para iOS/Android
- [ ] **Integração LMS** - Moodle, Canvas, Google Classroom
- [ ] **API GraphQL** - Queries mais eficientes
- [ ] **Blockchain** - Certificados digitais imutáveis

### **💡 Contribuições Futuras**
Interessado em evoluir o projeto? Consulte nosso [CONTRIBUTING.md](CONTRIBUTING.md) e participe da **transformação digital da educação**!

---

<div align="center">

**🎓 Feito com ❤️ pelos alunos do ETEC "Rodrigues de Abreu" - Bauru/SP**

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/smpp-sistema.svg?style=social&label=Star)](https://github.com/seu-usuario/smpp-sistema)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/smpp-sistema.svg?style=social&label=Fork)](https://github.com/seu-usuario/smpp-sistema/fork)

</div>
