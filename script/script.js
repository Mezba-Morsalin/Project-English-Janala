const lessonLoad = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(response => response.json())
    .then(data => {
        lessonCards(data.data);
    })
}
const lessonCards = (lessons) => {
    const lessonContainer = document.getElementById("lesson-container");
    lessonContainer.innerHTML = "";
    for (const lesson of lessons) {
        const newElement = document.createElement("div");
        newElement.innerHTML = `
        <button id="lesson-btn${lesson.level_no}" onclick="loadLessonWord(${lesson.level_no})" class="btn btn-outline btn-primary remove-bg"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `
        lessonContainer.append(newElement)
    }
}
lessonLoad()
const removeBackground = () => {
    const remove = document.querySelectorAll(".remove-bg");
    remove.forEach(element => {
        element.classList.remove("active")
    })
}
const loadLessonWord = (id) => {
    addSpin(true);
    const url =(`https://openapi.programming-hero.com/api/level/${id}`);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        removeBackground();
        const lessonBtn = document.getElementById(`lesson-btn${id}`);
        lessonBtn.classList.add("active")
        displayLessonWords(data.data)
    });
}
const displayLessonWords = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    if (words.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full">
        <img class="mx-auto mb-4" src="./assets/alert-error.png" alt="">
        <p class="font-bangla text-base  text-[#79716B] mb-3">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h3 class="text-[2rem] text-[#292524] font-bangla ">নেক্সট Lesson এ যান</h3>
      </div>
        `
    }
    words.forEach(element => {
       const newElement = document.createElement("div");
       newElement.innerHTML = `
       <div class="card1 bg-white text-center p-10 rounded-2xl">
        <h3 class="text-[2rem] font-bold mb-4">${element.word ? element.word : "শব্দ পাওয়া যায়নি"}</h3>
        <p class="text-xl font-medium mb-6">Meaning / Pronunciation</p>
        <h3 class="font-bangla text-[#18181B]/[80%] text-[2rem] font-semibold">${element.meaning ? element.meaning : "অর্থ পাওয়া যায়নি"} / ${element.pronunciation ? element.pronunciation : "Pronunciation পাওয়া যায়নি"}</h3>
        <div class="flex justify-between mt-8">
          <button onclick="loadWordDetails(${element.id})" class="bg-[#BADEFF]/[0.26] p-4 rounded cursor-pointer text-[#374957]"><i class="fa-solid fa-circle-exclamation"></i> </button>
          <button class="bg-[#BADEFF]/[0.26] p-4 cursor-pointer rounded text-[#374957]"><i class="fa-solid fa-volume-high"></i </button>
        </div>
      </div>
       `
       wordContainer.append(newElement);
    });
    addSpin(false);
}
const addSpin = (spins) => {
    const spin = document.getElementById("spin");
    const container = document.getElementById("word-container");

    if (spins === true) {
        spin.classList.remove("hidden");
        container.classList.add("hidden");
    } else {
        container.classList.remove("hidden");
        spin.classList.add("hidden");
    }
}

const loadWordDetails = async (id) => {
    const url = (`https://openapi.programming-hero.com/api/word/${id}`);
    const response = await fetch(url);
    const details = await response.json();
    displayWordsDetails(details.data)
}

const displayWordsDetails = (data) => {
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
    <h3 class="text-4xl font-semibold">
        ${data.word} 
        <span>(<i class="fa-solid fa-microphone-lines"></i> : ${data.pronunciation})</span>
    </h3>
    <p class="text-[1.5rem] font-bold">Meaning</p>
    <p class="text-[1.5rem] font-bangla">${data.meaning}</p>
    <p class="text-[1.5rem] font-bold">Example</p>
    <p class="text-[1.5rem] text-black/60">${data.sentence}</p>
    <p class="text-[1.5rem] font-bangla">Synonyms</p>
    <div class="flex gap-3 flex-wrap">
         ${data.synonyms.map(synonym => `<button class="btn bg-[#BADEFF]/[0.26]">${synonym}</button>`).join('')}
    </div>
    <div><button class="btn btn-primary rounded">Complete Learning</button></div>
    `;
    document.getElementById("words_modal").showModal();
}

document.getElementById("search-btn").addEventListener("click", () => {
    removeBackground();
    const input = document.getElementById("search-input");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue)
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(response => response.json())
    .then(data => {
        const allWords = data.data;
        console.log(allWords)
        const wordFilters = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLessonWords(wordFilters)
    })
})