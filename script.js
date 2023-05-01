//검색어를 재료로 포함한 음식 리스트 나열(형태 반복문)
//서치 버튼 누르면 서치됨(click 이벤트)
//검색어에 해당하는 음식 없을 시 not found 표시
//Get Recipe 버튼 클릭 시 세부 레시피 모달창 팝업
//모달창 닫기 버튼

const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content')
const recipeCloseBtn = document.getElementById('recipe-close-btn')


searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
})


function getMealList() {
    let serchInputText = document.getElementById('search-input').value.trim();//trim(): 앞뒤 공백을 지워줌 -> 공백 있어도 검색해줌
    //console.log(serchInputText); //input 안에 쓴 내용
    /* meal API */
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${serchInputText}`)
    .then(response => response.json())
    .then(data => {
        //console.log(data)
        let html = '';//mealList 들어올 공간 변수
        if(data.meals) {//json data 'meals'
            data.meals.map(meal => {//데이터를 meal 파라미터로 받아옴
                html += 
                `
                <div class="meal-item" data-id="${meal.idMeal}">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                    </div>
                </div>
                `
                mealList.classList.remove('notFound');
            })   
        }else{
           html = "Sorry, we didn't find any meal."
           mealList.classList.add('notFound');//style
        }
        mealList.innerHTML = html;//검색어에 맞게 생성된 mealList를 html에 넣음
    })
    .catch(error => {
        console.log(error)
    })
}

function getMealRecipe(e) {
    e.preventDefault();
    //console.log(e.target);
    if(e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        //console.log(mealItem);
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => {mealRecipeModal(data.meals)})
    }
}

function mealRecipeModal(meal) {
    //console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="food">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}