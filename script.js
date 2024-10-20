document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращает отправку формы
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
    this.reset(); // Сбросить форму
});