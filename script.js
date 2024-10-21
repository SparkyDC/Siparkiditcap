// JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем обработчик для кнопки смены темы
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Добавляем обработчики для студентов
    document.querySelectorAll('.student').forEach(student => {
        student.addEventListener('click', () => {
            const studentId = student.getAttribute('onclick').match(/'(.*?)'/)[1];
            showStudent(studentId);
        });
    });
});

let isDarkMode = false; // Переменная для отслеживания текущей темы

function toggleTheme() {
    isDarkMode = !isDarkMode; // Переключаем тему
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.querySelector('.header-bg').classList.toggle('dark-mode', isDarkMode);
    document.querySelector('.footer-bg').classList.toggle('dark-mode', isDarkMode);
    
    // Изменение цвета текста для темной темы
    if (isDarkMode) {
        document.body.style.backgroundColor = "#333"; // Темный фон
        document.body.style.color = "#fff"; // Белый текст
    } else {
        document.body.style.backgroundColor = "#ffffff"; // Светлый фон
        document.body.style.color = "#000"; // Черный текст
    }
    
    const themeButton = document.getElementById('theme-toggle');
    themeButton.innerHTML = isDarkMode ? '🌞' : '🌙'; // Смена иконки темы
}

function showStudent(student) {
    const studentInfo = document.getElementById('student-info');
    const studentName = document.getElementById('student-name');
    const studentMessage = document.getElementById('student-message');

    // Сброс информации перед выводом
    studentName.innerText = "";
    studentMessage.innerText = "";

    // Информация о студентах
    if (student === 'muslim') {
        studentName.innerText = "Абдураимов Муслим";
        studentMessage.innerText = "Стиль макако йоу!";
    } else if (student === 'abdali') {
        studentName.innerText = "Жаамбаев Абдалим";
        studentMessage.innerText = "Шышып кетем";
    } else if (student === 'abdunur') {
        studentName.innerText = "Жаамбаев Абдунур";
        studentMessage.innerText = "Соло комбэк!";
    }

    studentInfo.classList.remove('hidden'); // Показываем информацию о студенте
}