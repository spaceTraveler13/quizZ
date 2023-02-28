
// Движение вперед
const btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button){
    button.addEventListener("click",function(){
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card);
        if(thisCard.dataset.validate == "novalidate"){
            navigate("next",thisCard);
        } else {
            // сохранение данных при движении вперед
            saveAnswer(thisCardNumber,getCardData(thisCardNumber));
            // проверка на заполненность
            if(isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)){
                navigate("next",thisCard);
            } else {
                alert("Выберете ответ или заполните пустые поля");
            }
        }

    })
})

// Движение назад
const btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener("click",function(){
        let thisCard = this.closest("[data-card]")        
        navigate("prev",thisCard);
    })
})
// Движение по карточкам 
function navigate(direction,thisCard){
    let thisCardNumber = parseInt(thisCard.dataset.card);
    let nextCard;
    if(direction == "next"){
        nextCard = thisCardNumber + 1;
    }else if(direction == "prev"){
        nextCard = thisCardNumber - 1;
    }
    thisCard.classList.add("hidden");
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
}
// Сбор данных из карточек
function getCardData(number){
    let question;
    let result = [];
    // поиск карточки по номеру и атрибуту
    let currentCard = document.querySelector(`[data-card="${number}"]`)
    // поиск главного вопроса карточки
    question = currentCard.querySelector("[data-question]").innerText;
    // поиск радиокнопок
    let radioValues = currentCard.querySelectorAll('[type="radio"]');
    radioValues.forEach(function(item){
        if(item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })
    // поиск чекбоксов
    let checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function(item){
        if(item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })
    // поиск инпутов
    let inputValues = currentCard.querySelectorAll('[type="range"],[type="text"],[type="number"],[type="email"]');
        inputValues.forEach(function(item){            
            let itemValue = item.value;
            // проверка рэнжей на пустые поля
            if(item.value !== "0"){
                // обрезка пробелов у строк 
                if(itemValue.trim() != ""){
                    result.push({
                        name: item.name,
                        value: item.value
                    })
                }
            }
        })
    // Общий объект со всеми данными
    let data = {
        question: question,
        answer: result
    }
    return data
}
// Объект для сбора данных карточек
let answers = {
    2: null,
    3: null,
    4: null,
    5: null
}
// запись собранных данных в объект answers
function saveAnswer(number,data){
    answers[number] = data
}
// отмена стандартного поведения формы
document.getElementById('form').addEventListener('click', function(e){
    e.preventDefault();
})
// проверка на заполненость
function isFilled(number){
    console.log(answers[number].answer.length)
    if(answers[number].answer.length > 0){
        return true
    } else {
        return false
    }
}
// паттерн для проверки email
function validateEmail(email){
    let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}
// проверка на заполненность инпутов и чекбоксов
function checkOnRequired(number){
    let currentCard = document.querySelector(`[data-card="${number}"]`);
    let requiredFields = currentCard.querySelectorAll("[required]");

    let isValidArray = [];

    requiredFields.forEach(function(item){
        // проверка на валидность ввода в форму
        if(item.type == "checkbox" && item.checked == false){
            isValidArray.push(false);
        } else if(item.type == "email"){
            if(validateEmail(item.value)){
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });
    // проверка массива на заполненность
    if(isValidArray.indexOf(false) == -1){
        return true
    } else {
        return false
    }
}