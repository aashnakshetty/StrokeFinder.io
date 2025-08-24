// 🌟 Dropdown Menu Toggle
document.getElementById("menu-icon")?.addEventListener("click", () => {
  document.getElementById("mode-dropdown")?.classList.toggle("hidden");
});

// 🧭 Navigation for Patient & Medical Modes
document.getElementById("patientOption")?.addEventListener("click", () => {
  window.location.href = "patient.html";
});

document.getElementById("medicalOption")?.addEventListener("click", () => {
  window.location.href = "medical.html";
});

// 🔄 Loading Animation + Redirect Helper
function showLoadingAndRedirect(targetUrl) {
  const overlay = document.getElementById("loading-overlay");
  const loadingText = document.getElementById("loading-text");

  if (overlay && loadingText) {
    overlay.classList.remove("hidden");
    let count = 0;

    const dotCycle = setInterval(() => {
      loadingText.textContent = "Loading" + ".".repeat(count % 4);
      count++;
    }, 500);

    setTimeout(() => {
      clearInterval(dotCycle);
      window.location.href = targetUrl;
    }, 2500);
  } else {
    window.location.href = targetUrl;
  }
}

// 🚀 Navigation Click Handlers
function setupLoadingHandlers() {
  document.querySelector(".logo")?.addEventListener("click", function (e) {
    e.preventDefault();
    showLoadingAndRedirect(this.getAttribute("href"));
  });

  document.getElementById("profile-icon")?.addEventListener("click", function (e) {
    e.preventDefault();
    showLoadingAndRedirect("profile.html");
  });

  document.querySelector(".signup-btn")?.addEventListener("click", function (e) {
    e.preventDefault();
    showLoadingAndRedirect("signup.html");
  });

  document.querySelectorAll(".glow-link, .dropdown-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showLoadingAndRedirect(this.getAttribute("href"));
    });
  });
}

// 🧠 Stroke Questionnaire Logic Patient
window.addEventListener("load", () => {
  setupLoadingHandlers();

  const form = document.getElementById("strokeForm");
  if (!form) return;

  let questionIndex = 0;

  const questions = [
    {
      text: "What is your gender?",
      input: `
        <label><input type="radio" name="gender" value="Male"> Male</label>
        <label><input type="radio" name="gender" value="Female"> Female</label>
        <label><input type="radio" name="gender" value="Other"> Other</label>`
    },
    {
      text: "What is your age group?",
      input: `
        <label><input type="radio" name="age" value="18"> 0–21</label>
        <label><input type="radio" name="age" value="35"> 21–45</label>
        <label><input type="radio" name="age" value="55"> 45–65</label>
        <label><input type="radio" name="age" value="70"> 65+</label>`
    },
    {
      text: "What best describes your body type?",
      input: `
        <label><input type="radio" name="bmi" value="30"> Overweight</label>
        <label><input type="radio" name="bmi" value="15"> Underweight</label>
        <label><input type="radio" name="bmi" value="22"> Average weight</label>`
    },
    {
      text: "What type of area do you live in?",
      input: `
        <label><input type="radio" name="Residence_type" value="Urban"> Urban</label>
        <label><input type="radio" name="Residence_type" value="Rural"> Rural</label>`
    },
    {
      text: "Have you ever been married?",
      input: `
        <label><input type="radio" name="ever_married" value="Yes"> Yes</label>
        <label><input type="radio" name="ever_married" value="No"> No</label>`
    },
    {
      text: "What type of work do you do?",
      input: `
        <label><input type="radio" name="work_type" value="Private"> Private</label>
        <label><input type="radio" name="work_type" value="Self-employed"> Self-employed</label>
        <label><input type="radio" name="work_type" value="Govt_job"> Government Job</label>
        <label><input type="radio" name="work_type" value="children"> Student / Child</label>`
    },
    {
      text: "What best describes your smoking history?",
      input: `
        <label><input type="radio" name="smoking_status" value="never smoked"> Never Smoked</label>
        <label><input type="radio" name="smoking_status" value="formerly smoked"> Former Smoker</label>
        <label><input type="radio" name="smoking_status" value="smokes"> Current Smoker</label>`
    },
    {
      text: "Do you feel thirsty often, get frequent infections, or have been diagnosed with high sugar levels?",
      input: `
        <label><input type="radio" name="avg_glucose_level" value="180"> Yes</label>
        <label><input type="radio" name="avg_glucose_level" value="100"> No</label>
        <label><input type="radio" name="avg_glucose_level" value=""> Don't Know</label>`
    },
    {
      text: "Have you ever been told your blood pressure is high?",
      input: `
        <label><input type="radio" name="hypertension" value="1"> Yes</label>
        <label><input type="radio" name="hypertension" value="0"> No</label>`
    },
    {
      text: "Do you have any heart-related condition?",
      input: `
        <label><input type="radio" name="heart_disease" value="1"> Yes</label>
        <label><input type="radio" name="heart_disease" value="0"> No</label>`
    }
  ];

  const userData = {};
  const questionText = document.getElementById("question-text");
  const questionOptions = document.getElementById("question-options");
  const questionNumber = document.getElementById("question-number");
  const nextBtn = document.getElementById("next-question-btn");
  const prevBtn = document.getElementById("prev-question-btn");
  const dualButtons = document.querySelector(".dual-buttons");
  const finalButtons = document.querySelector(".final-buttons");
  const finalSubmitBtn = document.getElementById("submit-button");
  
  // 🧠 Save current answer before moving forward
  function saveCurrentAnswer() {
    const currentQuestion = questions[questionIndex];
    const inputName = currentQuestion.input.match(/name="(.*?)"/)?.[1];
    const selected = document.querySelector(`input[name="${inputName}"]:checked`);
    if (selected) {
      userData[inputName] = selected.value;
    }
  }



  // ⬅️ PREV & ➡️ NEXT Button Logic
  nextBtn.addEventListener("click", () => {
    if (!validateSelection()) return;
    saveCurrentAnswer();
    animateSwap(() => {
      questionIndex++;
      updateQuestionUI();
    });
  });

  prevBtn.addEventListener("click", () => {
    questionIndex--;
    updateQuestionUI();
  });

  // ✅ Submit Button Logic
  if (finalSubmitBtn) {
      finalSubmitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        finalSubmitBtn.disabled = true;

        saveCurrentAnswer(); 

        // ✅ Show loading overlay
        const overlay = document.getElementById("loading-overlay");
        if (overlay) overlay.classList.remove("hidden");

        fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        })
        .then(res => res.json())
        .then(data => {
          console.log("🧠 Full response from API:", data);
          localStorage.setItem("strokePrediction", data.prediction ?? "Unknown");
          window.location.href = "results.html";
        })
        .catch(err => {
          alert("Something went wrong 😢");
          console.error("Fetch error:", err);
          finalSubmitBtn.disabled = false; 

          if (overlay) overlay.classList.add("hidden");
        });
       });
    }
    

  // ✨ UI Updates
  function updateQuestionUI() {
    questionNumber.textContent = `Q.${questionIndex + 1}`;
    questionText.textContent = questions[questionIndex].text;
    questionOptions.innerHTML = questions[questionIndex].input;

    nextBtn.style.display = questionIndex < questions.length - 1 ? "inline-block" : "none";
    prevBtn.style.display = questionIndex === 0 ? "none" : "inline-block";

    const isLast = questionIndex === questions.length - 1;

    dualButtons.classList.toggle("single-button", questionIndex === 0);
    dualButtons.style.display = isLast ? "none" : "flex";
    finalButtons.style.display = isLast ? "flex" : "none";

    document.querySelector(".prev-question-final")?.addEventListener("click", () => {
      questionIndex--;
      updateQuestionUI();
    });

    animateIn();
  }

  // 🔄 Animations
  function animateSwap(callback) {
    questionText.classList.add("swipe-left");
    questionOptions.classList.add("swipe-left");
    setTimeout(() => {
      callback();
      questionText.classList.remove("swipe-left");
      questionOptions.classList.remove("swipe-left");
    }, 500);
  }

  function animateIn() {
    questionText.classList.add("swipe-in");
    questionOptions.classList.add("swipe-in");
    setTimeout(() => {
      questionText.classList.remove("swipe-in");
      questionOptions.classList.remove("swipe-in");
    }, 500);
  }

  // ✅ Input Validation
  function validateSelection() {
    const currentInputName = questions[questionIndex].input.match(/name="(.*?)"/)?.[1];
    const selected = document.querySelector(`input[name="${currentInputName}"]:checked`);
    if (!selected) {
      alert("Please select an option before continuing.");
      return false;
    }
    return true;
  }


  // 🚀 Initialize
  updateQuestionUI();
  console.log("Current question:", questions[questionIndex]);
  console.log("Submit button clicked");


});