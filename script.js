const students = {
    muslim: {
        name: "Абдураимов Муслим",
        message: "Стиль макако йоу!"
    },
    abdali: {
        name: "Жаамбаев Абдалим",
        message: "Шышып кетем"
    },
    abdunur: {
        name: "Жаамбаев Абдунур",
        message: "Соло комбэк"
    }
};

function showStudent(studentKey) {
    document.getElementById("student-info").classList.remove("hidden");
    document.getElementById("student-name").innerText = students[studentKey].name;
    document.getElementById("student-message").innerText = "";
    document.getElementById("password").value = ""; // сброс пароля
}

function checkPassword() {
    const password = document.getElementById("password").value;
    const studentKey = document.getElementById("student-name").innerText.split(" ")[0].toLowerCase();

    if (password === "123456") {
        document.getElementById("student-message").innerText = students[studentKey].message;
    } else {
        alert("Неверный пароль!");
    }
}