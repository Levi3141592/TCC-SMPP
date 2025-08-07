import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

// Mock data para simular dados do PostgreSQL
const mockData = {
  activities: [
    {
      id: 1,
      subject_id: 1,
      teacher_id: 1,
      class_id: 1,
      room: 'A101',
      scheduled_start: '2025-08-06T08:00:00',
      scheduled_end: '2025-08-06T09:30:00',
      type: 'class',
      subject: { name: 'Matemática', code: 'MAT101' },
      teacher: { name: 'Prof. Silva' },
      class: { name: '3º A', grade_level: '3º ano' }
    },
    {
      id: 2,
      subject_id: 2,
      teacher_id: 2,
      class_id: 2,
      room: 'B203',
      scheduled_start: '2025-08-06T10:00:00',
      scheduled_end: '2025-08-06T11:30:00',
      type: 'test',
      subject: { name: 'História', code: 'HIS102' },
      teacher: { name: 'Prof. Santos' },
      class: { name: '2º B', grade_level: '2º ano' }
    },
    {
      id: 3,
      subject_id: 3,
      teacher_id: 3,
      class_id: 1,
      room: 'Lab01',
      scheduled_start: '2025-08-07T14:00:00',
      scheduled_end: '2025-08-07T16:00:00',
      type: 'seminar',
      subject: { name: 'Química', code: 'QUI103' },
      teacher: { name: 'Prof. Costa' },
      class: { name: '3º A', grade_level: '3º ano' }
    }
  ],
  subjects: [
    { id: 1, name: 'Matemática', code: 'MAT101' },
    { id: 2, name: 'História', code: 'HIS102' },
    { id: 3, name: 'Química', code: 'QUI103' },
    { id: 4, name: 'Física', code: 'FIS104' }
  ],
  teachers: [
    { id: 1, name: 'Prof. Silva' },
    { id: 2, name: 'Prof. Santos' },
    { id: 3, name: 'Prof. Costa' }
  ],
  classes: [
    { id: 1, name: '3º A', grade_level: '3º ano' },
    { id: 2, name: '2º B', grade_level: '2º ano' },
    { id: 3, name: '1º C', grade_level: '1º ano' }
  ],
  rooms: ['A101', 'A102', 'B203', 'B204', 'Lab01', 'Lab02', 'Auditório']
};

const CalendarScheduler = () => {
  const [activities, setActivities] = useState(mockData.activities);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoom, setFilterRoom] = useState('');

  const [formData, setFormData] = useState({
    subject_id: '',
    teacher_id: '',
    class_id: '',
    room: '',
    scheduled_start: '',
    scheduled_end: '',
    type: 'class'
  });

  const resetForm = () => {
    setFormData({
      subject_id: '',
      teacher_id: '',
      class_id: '',
      room: '',
      scheduled_start: '',
      scheduled_end: '',
      type: 'class'
    });
    setEditingActivity(null);
  };

  const openModal = (activity = null) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        subject_id: activity.subject_id,
        teacher_id: activity.teacher_id,
        class_id: activity.class_id,
        room: activity.room,
        scheduled_start: activity.scheduled_start.slice(0, 16),
        scheduled_end: activity.scheduled_end.slice(0, 16),
        type: activity.type
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = () => {
    
    const subject = mockData.subjects.find(s => s.id === parseInt(formData.subject_id));
    const teacher = mockData.teachers.find(t => t.id === parseInt(formData.teacher_id));
    const classInfo = mockData.classes.find(c => c.id === parseInt(formData.class_id));

    const activityData = {
      ...formData,
      subject_id: parseInt(formData.subject_id),
      teacher_id: parseInt(formData.teacher_id),
      class_id: parseInt(formData.class_id),
      subject,
      teacher,
      class: classInfo
    };

    if (editingActivity) {
      setActivities(activities.map(a => 
        a.id === editingActivity.id ? { ...activityData, id: editingActivity.id } : a
      ));
    } else {
      setActivities([...activities, { ...activityData, id: Date.now() }]);
    }
    
    closeModal();
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getActivityTypeColor = (type) => {
    const colors = {
      class: 'bg-blue-100 text-blue-800 border-blue-200',
      test: 'bg-red-100 text-red-800 border-red-200',
      seminar: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getActivityTypeIcon = (type) => {
    const icons = {
      class: '📚',
      test: '📝',
      seminar: '🎓'
    };
    return icons[type] || '📅';
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoom = !filterRoom || activity.room === filterRoom;
    
    return matchesSearch && matchesRoom;
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Adicionar dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Adicionar dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Completar a grade com dias do próximo mês
    while (days.length < 42) {
      const nextDate = new Date(year, month + 1, days.length - daysInMonth - startingDayOfWeek + 1);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const getActivitiesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredActivities.filter(activity => 
      activity.scheduled_start.startsWith(dateStr)
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-8 h-8 text-blue-600" />
                Sistema de Agendamento
              </h1>
              <p className="text-gray-600 mt-1">Gerencie atividades e salas de aula</p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nova Atividade
            </button>
          </div>

          {/* Filtros */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por matéria, professor ou sala..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
              >
                <option value="">Todas as salas</option>
                {mockData.rooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navegação do Calendário */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigateMonth(-1)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Anterior
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Próximo →
            </button>
          </div>
        </div>

        {/* Calendário */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-50 rounded">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayActivities = getActivitiesForDate(day.date);
              const isToday = day.date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${
                    day.isCurrentMonth 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayActivities.slice(0, 2).map(activity => (
                      <div
                        key={activity.id}
                        className={`text-xs p-1 rounded border ${getActivityTypeColor(activity.type)} truncate`}
                        title={`${activity.subject.name} - ${activity.teacher.name} - ${activity.room}`}
                      >
                        <div className="flex items-center gap-1">
                          <span>{getActivityTypeIcon(activity.type)}</span>
                          <span className="truncate">{activity.subject.name}</span>
                        </div>
                        <div className="text-xs opacity-75">
                          {formatTime(activity.scheduled_start)} - {activity.room}
                        </div>
                      </div>
                    ))}
                    {dayActivities.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayActivities.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista de Atividades do Dia Selecionado */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Atividades de {formatDate(selectedDate)}
          </h3>
          
          {getActivitiesForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhuma atividade agendada para este dia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getActivitiesForDate(selectedDate).map(activity => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border-l-4 ${getActivityTypeColor(activity.type)} hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getActivityTypeIcon(activity.type)}</span>
                        <h4 className="font-semibold text-gray-900">{activity.subject.name}</h4>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {activity.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(activity.scheduled_start)} - {formatTime(activity.scheduled_end)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Sala {activity.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{activity.class.name}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Professor: {activity.teacher.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(activity)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {editingActivity ? 'Editar Atividade' : 'Nova Atividade'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matéria
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.subject_id}
                    onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                  >
                    <option value="">Selecione a matéria</option>
                    {mockData.subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professor
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                  >
                    <option value="">Selecione o professor</option>
                    {mockData.teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turma
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.class_id}
                    onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                  >
                    <option value="">Selecione a turma</option>
                    {mockData.classes.map(classInfo => (
                      <option key={classInfo.id} value={classInfo.id}>
                        {classInfo.name} - {classInfo.grade_level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sala
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                  >
                    <option value="">Selecione a sala</option>
                    {mockData.rooms.map(room => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Atividade
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="class">Aula</option>
                    <option value="test">Prova</option>
                    <option value="seminar">Seminário</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Início
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.scheduled_start}
                      onChange={(e) => setFormData({...formData, scheduled_start: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fim
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.scheduled_end}
                      onChange={(e) => setFormData({...formData, scheduled_end: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingActivity ? 'Salvar Alterações' : 'Criar Atividade'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarScheduler;
