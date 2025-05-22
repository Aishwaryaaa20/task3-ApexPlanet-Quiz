// --- Interactive Quiz ---
const quizData = [
  {
    question: "Which word is the opposite of 'increase'?",
    options: ["Grow", "Expand", "Reduce", "Multiply"],
    answer: "Reduce",
    explanation: "'Reduce' means to make smaller or less, which is the opposite of 'increase'."
  },
  {
    question: "Which image shows a cat?",
    options: [
      "https://media.istockphoto.com/id/2190268160/photo/toyger-cat-sitting-and-looking-away-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=C4WOYE198-NwWY3d6Kk6H2NJ3lIe5Nb1e1mN42IDaSw=",
      "https://images.unsplash.com/photo-1422565096762-bdb997a56a84?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFuaW1hbHN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFuaW1hbHN8ZW58MHx8MHx8fDA%3D"
    ],
    answer: "https://media.istockphoto.com/id/2190268160/photo/toyger-cat-sitting-and-looking-away-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=C4WOYE198-NwWY3d6Kk6H2NJ3lIe5Nb1e1mN42IDaSw=",
    explanation: "The first image is a Cat.",
    type: "image"
  },
  {
    question: "Which word means 'quickly'?",
    options: ["Slowly", "Rapidly", "Lazily", "Calmly"],
    answer: "Rapidly",
    explanation: "'Rapidly' means very quickly; at a great rate."
  },
  {
    question: "Which is the antonym of 'ancient'?",
    options: ["Old", "Modern", "Historic", "Past"],
    answer: "Modern",
    explanation: "'Modern' means relating to the present or recent times, which is the opposite of 'ancient'."
  },
  {
    question: "Which word is related to 'education'?",
    options: ["Teacher", "Baker", "Driver", "Painter"],
    answer: "Teacher",
    explanation: "A 'Teacher' is directly related to education, as they help students learn."
  }
];
let currentQuiz = 0;
let score = 0;
let results = Array(quizData.length).fill(null); // null = unanswered

function renderDots() {
  const dots = results.map((res, i) => {
    let cls = "quiz-dot";
    if (res === true) cls += " correct";
    else if (res === false) cls += " incorrect";
    else if (i === currentQuiz) cls += " active";
    return `<span class="${cls}"></span>`;
  }).join('');
  document.getElementById('quizDots').innerHTML = dots;
}

function loadQuiz() {
  document.getElementById('quizResult').textContent = '';
  const q = quizData[currentQuiz];
  document.getElementById('quizQuestion').textContent = q.question;
  const optionsDiv = document.getElementById('quizOptions');
  optionsDiv.innerHTML = '';

  // If this is the image carousel question (second question)
  if (q.type === "image") {
    let carouselOptIndex = 0;
    optionsDiv.innerHTML = `
      <div id="imgCarousel" style="display:flex;align-items:center;gap:12px;justify-content:center;">
        <button id="imgPrev" style="font-size:1.5em;">&#8592;</button>
        <img id="imgCurrent" src="${q.options[0]}" alt="option" style="width:120px;height:80px;object-fit:cover;border-radius:8px;border:2px solid #bbb;">
        <button id="imgNext" style="font-size:1.5em;">&#8594;</button>
      </div>
    `;

    // Carousel logic
    document.getElementById('imgPrev').onclick = function() {
      carouselOptIndex = (carouselOptIndex - 1 + q.options.length) % q.options.length;
      document.getElementById('imgCurrent').src = q.options[carouselOptIndex];
    };
    document.getElementById('imgNext').onclick = function() {
      carouselOptIndex = (carouselOptIndex + 1) % q.options.length;
      document.getElementById('imgCurrent').src = q.options[carouselOptIndex];
    };

    // Override submit for this question
    document.getElementById('quizSubmit').onclick = function() {
      const selected = q.options[carouselOptIndex];
      if (selected === q.answer) {
        score++;
        results[currentQuiz] = true;
        document.getElementById('quizResult').style.color = "green";
        document.getElementById('quizResult').textContent = "Correct!";
      } else {
        results[currentQuiz] = false;
        document.getElementById('quizResult').style.color = "#d8000c";
        document.getElementById('quizResult').innerHTML =
          "Wrong! Correct answer was the correct image." +
          "<br><span style='color:#222;font-weight:normal'>" +
          q.explanation + "</span>";
      }
      renderDots();
      setTimeout(() => {
        currentQuiz++;
        if (currentQuiz < quizData.length) {
          loadQuiz();
        } else {
          showFinalScore();
        }
      }, 1800);
    };
    renderDots();
    return;
  }

  // Default: radio buttons for other questions
  q.options.forEach(opt => {
    const id = 'opt_' + opt.replace(/\s/g, '');
    optionsDiv.innerHTML += `
      <label>
        <input type="radio" name="quizOpt" value="${opt}" id="${id}"> ${opt}
      </label>
    `;
  });
  document.getElementById('quizCounter').textContent = `Question ${currentQuiz + 1} of ${quizData.length}`;
  renderDots();

  // Default submit logic for non-carousel questions
  document.getElementById('quizSubmit').onclick = function() {
    const opts = document.getElementsByName('quizOpt');
    let selected = '';
    for (let o of opts) {
      if (o.checked) selected = o.value;
    }
    if (!selected) {
      document.getElementById('quizResult').textContent = "Please select an answer!";
      return;
    }
    if (selected === q.answer) {
      score++;
      results[currentQuiz] = true;
      document.getElementById('quizResult').style.color = "green";
      document.getElementById('quizResult').textContent = "Correct!";
    } else {
      results[currentQuiz] = false;
      document.getElementById('quizResult').style.color = "#d8000c";
      document.getElementById('quizResult').innerHTML =
        "Wrong! Correct answer: " + q.answer +
        "<br><span style='color:#222;font-weight:normal'>" +
        q.explanation + "</span>";
    }
    renderDots();
    setTimeout(() => {
      currentQuiz++;
      if (currentQuiz < quizData.length) {
        loadQuiz();
      } else {
        showFinalScore();
      }
    }, 1800);
  };
}

function showFinalScore() {
  document.getElementById('quizQuestion').textContent = "Quiz Completed!";
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizSubmit').style.display = 'none';
  document.getElementById('quizResult').style.color = "#2d217c";
  let stars = '';
  for (let i = 0; i < quizData.length; i++) {
    stars += (results[i] === true) ? '★' : '☆';
  }
  // Gather explanations for wrong answers
  let explanations = '';
  for (let i = 0; i < quizData.length; i++) {
    if (results[i] === false) {
      explanations += `<div style="margin:8px 0 0 0;"><b>Q${i+1}:</b> ${quizData[i].question}<br>
        <span style="color:#d8000c;">${quizData[i].explanation}</span></div>`;
    }
  }
  document.getElementById('quizResult').innerHTML = 
    `<span style="font-size:2em; color:#FFD700;">${stars}</span><br>Your Score: ${score} / ${quizData.length}` +
    (explanations ? `<div style="margin-top:18px;"><b>Explanations:</b>${explanations}</div>` : "");
  renderDots();
}

loadQuiz();
renderDots();

// --- Fetch Data from API (Joke) ---
document.getElementById('jokeBtn').onclick = async function() {
  const jokeBox = document.getElementById('jokeBox');
  jokeBox.textContent = "Loading...";
  try {
    const res = await fetch('https://official-joke-api.appspot.com/random_joke');
    const data = await res.json();
    jokeBox.textContent = data.setup + " " + data.punchline;
  } catch (err) {
    jokeBox.textContent = "Failed to fetch joke.";
  }
};