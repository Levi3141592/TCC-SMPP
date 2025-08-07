-- =====================================================
-- SISTEMA DE AGENDAMENTO DE SALAS - POSTGRESQL SCHEMA
-- =====================================================

-- Criar banco de dados (executar como superusuário)
-- CREATE DATABASE school_scheduler;
-- \c school_scheduler;

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Tabela: person (usuários do sistema)
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hash da senha
    email VARCHAR(100) UNIQUE NOT NULL,
    profile_picture VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'staff')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: class (turmas)
CREATE TABLE class (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    grade_level VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    shift VARCHAR(20) NOT NULL CHECK (shift IN ('morning', 'afternoon', 'evening', 'night')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: student (estudantes)
CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    person_id INTEGER UNIQUE NOT NULL,
    enrollment_number VARCHAR(20) UNIQUE NOT NULL,
    class_id INTEGER,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred', 'graduated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE SET NULL
);

-- Tabela: teacher (professores)
CREATE TABLE teacher (
    id SERIAL PRIMARY KEY,
    person_id INTEGER UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE
);

-- Tabela: staff (funcionários)
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    person_id INTEGER UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE
);

-- Tabela: subject (matérias)
CREATE TABLE subject (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    workload_hours INTEGER NOT NULL CHECK (workload_hours > 0),
    description TEXT,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: activity (atividades/aulas)
CREATE TABLE activity (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    room VARCHAR(50) NOT NULL,
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('class', 'test', 'seminar', 'workshop', 'exam')),
    description TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teacher(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE,
    
    -- Validações
    CONSTRAINT valid_time_range CHECK (scheduled_end > scheduled_start),
    CONSTRAINT valid_duration CHECK (scheduled_end - scheduled_start <= INTERVAL '8 hours')
);

-- Tabela: grade (notas)
CREATE TABLE grade (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    score DECIMAL(5,2) CHECK (score >= 0 AND score <= 10),
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'graded', 'revision')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE CASCADE,
    
    UNIQUE(student_id, activity_id)
);

-- Tabela: access_log (controle de acesso)
CREATE TABLE access_log (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_type VARCHAR(10) NOT NULL CHECK (access_type IN ('IN', 'OUT')),
    access_point VARCHAR(50) NOT NULL,
    device_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE
);

-- Tabela: document (documentos)
CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    created_by INTEGER NOT NULL,
    visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('student', 'teacher', 'staff', 'public')),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    
    FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE CASCADE
);

-- Tabela: notification (notificações)
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER,
    receiver_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'reminder')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'archived')),
    read_at TIMESTAMP,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    
    FOREIGN KEY (sender_id) REFERENCES person(id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_id) REFERENCES person(id) ON DELETE CASCADE
);

-- Tabela: chatbot_log (logs do chatbot)
CREATE TABLE chatbot_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    session_id UUID DEFAULT uuid_generate_v4(),
    message_text TEXT NOT NULL,
    intent_detected VARCHAR(100),
    confidence_score DECIMAL(3,2),
    response_text TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processing_time_ms INTEGER,
    
    FOREIGN KEY (user_id) REFERENCES person(id) ON DELETE SET NULL
);

-- Tabela: device (dispositivos de acesso)
CREATE TABLE device (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('turnstile', 'rfid_reader', 'camera', 'sensor', 'tablet')),
    location VARCHAR(100) NOT NULL,
    ip_address INET,
    mac_address MACADDR,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'error')),
    last_seen TIMESTAMP,
    firmware_version VARCHAR(50),
    installed_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas frequentes
CREATE INDEX idx_person_login ON person(login);
CREATE INDEX idx_person_email ON person(email);
CREATE INDEX idx_person_role ON person(role);

CREATE INDEX idx_student_enrollment ON student(enrollment_number);
CREATE INDEX idx_student_class ON student(class_id);

CREATE INDEX idx_activity_date ON activity(scheduled_start, scheduled_end);
CREATE INDEX idx_activity_room ON activity(room);
CREATE INDEX idx_activity_teacher ON activity(teacher_id);
CREATE INDEX idx_activity_subject ON activity(subject_id);
CREATE INDEX idx_activity_class ON activity(class_id);
CREATE INDEX idx_activity_type ON activity(type);

CREATE INDEX idx_grade_student ON grade(student_id);
CREATE INDEX idx_grade_activity ON grade(activity_id);

CREATE INDEX idx_access_log_person ON access_log(person_id);
CREATE INDEX idx_access_log_timestamp ON access_log(timestamp);

CREATE INDEX idx_notification_receiver ON notification(receiver_id);
CREATE INDEX idx_notification_status ON notification(status);
CREATE INDEX idx_notification_timestamp ON notification(timestamp);

CREATE INDEX idx_document_visibility ON document(visibility);
CREATE INDEX idx_document_created_by ON document(created_by);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em tabelas que têm updated_at
CREATE TRIGGER update_person_updated_at BEFORE UPDATE ON person
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_updated_at BEFORE UPDATE ON class
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_updated_at BEFORE UPDATE ON student
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_updated_at BEFORE UPDATE ON teacher
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subject_updated_at BEFORE UPDATE ON subject
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_updated_at BEFORE UPDATE ON activity
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grade_updated_at BEFORE UPDATE ON grade
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_updated_at BEFORE UPDATE ON device
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para criptografar senhas
CREATE OR REPLACE FUNCTION encrypt_password(plain_password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(plain_password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql;

-- Função para verificar senhas
CREATE OR REPLACE FUNCTION verify_password(plain_password TEXT, encrypted_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN encrypted_password = crypt(plain_password, encrypted_password);
END;
$$ LANGUAGE plpgsql;

-- Função para verificar conflitos de horário
CREATE OR REPLACE FUNCTION check_schedule_conflict(
    p_room VARCHAR(50),
    p_start_time TIMESTAMP,
    p_end_time TIMESTAMP,
    p_activity_id INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflict_count
    FROM activity
    WHERE room = p_room
    AND status != 'cancelled'
    AND (p_activity_id IS NULL OR id != p_activity_id)
    AND (
        (scheduled_start <= p_start_time AND scheduled_end > p_start_time) OR
        (scheduled_start < p_end_time AND scheduled_end >= p_end_time) OR
        (scheduled_start >= p_start_time AND scheduled_end <= p_end_time)
    );
    
    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir pessoas (usuários do sistema)
INSERT INTO person (login, password, email, role) VALUES
('admin', encrypt_password('admin123'), 'admin@escola.com', 'staff'),
('prof.silva', encrypt_password('prof123'), 'silva@escola.com', 'teacher'),
('prof.santos', encrypt_password('prof123'), 'santos@escola.com', 'teacher'),
('prof.costa', encrypt_password('prof123'), 'costa@escola.com', 'teacher'),
('joao.aluno', encrypt_password('aluno123'), 'joao@email.com', 'student'),
('maria.aluna', encrypt_password('aluno123'), 'maria@email.com', 'student'),
('secretaria', encrypt_password('sec123'), 'secretaria@escola.com', 'staff');

-- Inserir turmas
INSERT INTO class (name, grade_level, year, shift) VALUES
('3º A', '3º ano', 2025, 'morning'),
('3º B', '3º ano', 2025, 'morning'),
('2º A', '2º ano', 2025, 'afternoon'),
('2º B', '2º ano', 2025, 'afternoon'),
('1º A', '1º ano', 2025, 'morning'),
('1º B', '1º ano', 2025, 'afternoon');

-- Inserir funcionários
INSERT INTO staff (person_id, department, position) VALUES
(1, 'Administração', 'Diretor'),
(7, 'Secretaria', 'Secretário');

-- Inserir professores
INSERT INTO teacher (person_id, department, position) VALUES
(2, 'Matemática', 'Professor Titular'),
(3, 'História', 'Professor Titular'),
(4, 'Ciências', 'Professor Titular');

-- Inserir estudantes
INSERT INTO student (person_id, enrollment_number, class_id) VALUES
(5, '2025001', 1),
(6, '2025002', 1);

-- Inserir matérias
INSERT INTO subject (name, code, workload_hours, department) VALUES
('Matemática', 'MAT101', 80, 'Matemática'),
('História', 'HIS102', 60, 'Ciências Humanas'),
('Química', 'QUI103', 80, 'Ciências'),
('Física', 'FIS104', 80, 'Ciências'),
('Português', 'POR105', 80, 'Linguagens'),
('Inglês', 'ING106', 60, 'Linguagens');

-- Inserir atividades de exemplo
INSERT INTO activity (subject_id, teacher_id, class_id, room, scheduled_start, scheduled_end, type, description) VALUES
(1, 1, 1, 'A101', '2025-08-06 08:00:00', '2025-08-06 09:30:00', 'class', 'Aula de Álgebra Linear'),
(2, 2, 3, 'B203', '2025-08-06 10:00:00', '2025-08-06 11:30:00', 'test', 'Prova sobre Brasil Colonial'),
(3, 3, 1, 'Lab01', '2025-08-07 14:00:00', '2025-08-07 16:00:00', 'seminar', 'Seminário sobre Química Orgânica'),
(1, 1, 1, 'A101', '2025-08-07 08:00:00', '2025-08-07 09:30:00', 'class', 'Aula de Geometria'),
(4, 3, 2, 'Lab02', '2025-08-08 15:00:00', '2025-08-08 16:30:00', 'class', 'Aula Prática de Física');

-- Inserir dispositivos
INSERT INTO device (name, type, location, status) VALUES
('Catraca Principal', 'turnstile', 'Entrada Principal', 'active'),
('Leitor RFID Lab', 'rfid_reader', 'Laboratório de Informática', 'active'),
('Câmera Pátio', 'camera', 'Pátio Central', 'active'),
('Tablet Secretaria', 'tablet', 'Secretaria', 'active');

-- Inserir notificações de exemplo
INSERT INTO notification (sender_id, receiver_id, title, message, type) VALUES
(1, 5, 'Bem-vindo!', 'Bem-vindo ao sistema de agendamento da escola!', 'info'),
(2, 5, 'Prova Agendada', 'Você tem uma prova de História agendada para amanhã às 10h00.', 'reminder');

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: Atividades com detalhes completos
CREATE VIEW v_activities_detailed AS
SELECT 
    a.id,
    a.scheduled_start,
    a.scheduled_end,
    a.room,
    a.type,
    a.description,
    a.status,
    s.name as subject_name,
    s.code as subject_code,
    p.login as teacher_login,
    CONCAT(p.login) as teacher_name,
    c.name as class_name,
    c.grade_level,
    c.shift
FROM activity a
JOIN subject s ON a.subject_id = s.id
JOIN teacher t ON a.teacher_id = t.id
JOIN person p ON t.person_id = p.id
JOIN class c ON a.class_id = c.id;

-- View: Estatísticas por sala
CREATE VIEW v_room_statistics AS
SELECT 
    room,
    COUNT(*) as total_activities,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_activities,
    COUNT(CASE WHEN type = 'class' THEN 1 END) as classes,
    COUNT(CASE WHEN type = 'test' THEN 1 END) as tests,
    COUNT(CASE WHEN type = 'seminar' THEN 1 END) as seminars
FROM activity
GROUP BY room
ORDER BY room;

-- View: Agenda do dia
CREATE VIEW v_daily_schedule AS
SELECT 
    DATE(scheduled_start) as schedule_date,
    TIME(scheduled_start) as start_time,
    TIME(scheduled_end) as end_time,
    room,
    subject_name,
    teacher_name,
    class_name,
    type,
    status
FROM v_activities_detailed
WHERE scheduled_start >= CURRENT_DATE
ORDER BY schedule_date, start_time;

-- =====================================================
-- PROCEDURES ÚTEIS
-- =====================================================

-- Procedure para criar uma nova atividade com verificação de conflito
CREATE OR REPLACE FUNCTION create_activity_safe(
    p_subject_id INTEGER,
    p_teacher_id INTEGER,
    p_class_id INTEGER,
    p_room VARCHAR(50),
    p_start_time TIMESTAMP,
    p_end_time TIMESTAMP,
    p_type VARCHAR(20),
    p_description TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    new_activity_id INTEGER;
BEGIN
    -- Verificar conflito de horário
    IF NOT check_schedule_conflict(p_room, p_start_time, p_end_time) THEN
        RAISE EXCEPTION 'Conflito de horário detectado para a sala % no período especificado', p_room;
    END IF;
    
    -- Inserir a atividade
    INSERT INTO activity (subject_id, teacher_id, class_id, room, scheduled_start, scheduled_end, type, description)
    VALUES (p_subject_id, p_teacher_id, p_class_id, p_room, p_start_time, p_end_time, p_type, p_description)
    RETURNING id INTO new_activity_id;
    
    RETURN new_activity_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERMISSÕES E SEGURANÇA
-- =====================================================

-- Criar usuários específicos (opcional)
-- CREATE ROLE school_admin WITH LOGIN PASSWORD 'admin_password';
-- CREATE ROLE school_teacher WITH LOGIN PASSWORD 'teacher_password';
-- CREATE ROLE school_student WITH LOGIN PASSWORD 'student_password';

-- Conceder permissões
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO school_admin;
-- GRANT SELECT, INSERT, UPDATE ON activity, grade TO school_teacher;
-- GRANT SELECT ON person, class, subject, activity TO school_student;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

COMMENT ON DATABASE school_scheduler IS 'Sistema de Agendamento de Salas Escolares';
COMMENT ON TABLE person IS 'Usuários do sistema (estudantes, professores, funcionários)';
COMMENT ON TABLE activity IS 'Atividades agendadas (aulas, provas, seminários)';
COMMENT ON TABLE grade IS 'Notas e avaliações dos estudantes';
COMMENT ON TABLE access_log IS 'Log de acessos ao sistema e instalações';
COMMENT ON FUNCTION check_schedule_conflict IS 'Verifica conflitos de agendamento para uma sala';

-- Exibir estatísticas das tabelas criadas
SELECT 
    tablename as "Tabela",
    schemaname as "Schema"
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;