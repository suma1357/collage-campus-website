document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar");
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      const open = navbar.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  const subjectList = document.querySelector("#subject-list");
  if (subjectList) {
    const options = ["Bangla", "English", "Mathematics", "Physics", "Chemistry", "Biology", "ICT", "Computer Science", "Accounting", "Economics", "Statistics", "History", "Other"];
    const gradingScale = [
      { min: 80, grade: "A+", point: 4.00 },
      { min: 70, grade: "A", point: 3.50 },
      { min: 60, grade: "A−", point: 3.00 },
      { min: 50, grade: "B", point: 2.50 },
      { min: 40, grade: "C", point: 2.00 },
      { min: 33, grade: "D", point: 1.00 },
      { min: 0, grade: "F", point: 0.00 }
    ];
    const getGrade = (mark) => gradingScale.find(item => mark >= item.min);
    const message = document.querySelector("#gpa-message");
    const resultPanel = document.querySelector("#results-panel");

    function makeRow(selected = "") {
      const row = document.createElement("div");
      row.className = "subject-row";
      const select = document.createElement("select");
      select.className = "subject-select";
      select.setAttribute("aria-label", "Subject");
      options.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name === "Other" ? "Other subject" : name;
        if (name === selected) option.selected = true;
        select.appendChild(option);
      });
      const input = document.createElement("input");
      input.className = "mark-input";
      input.type = "number";
      input.min = "0";
      input.max = "100";
      input.placeholder = "e.g. 85";
      input.setAttribute("aria-label", "Marks");
      const grade = document.createElement("span");
      grade.className = "grade-result";
      grade.textContent = "—";
      const point = document.createElement("span");
      point.className = "point-result";
      point.textContent = "—";
      const remove = document.createElement("button");
      remove.className = "remove-subject";
      remove.type = "button";
      remove.textContent = "×";
      remove.title = "Remove subject";
      remove.setAttribute("aria-label", "Remove subject");
      row.append(select, input, grade, point, remove);
      return row;
    }

    document.querySelector("#add-subject")?.addEventListener("click", () => {
      subjectList.appendChild(makeRow());
      message.textContent = "";
    });

    subjectList.addEventListener("click", (event) => {
      const button = event.target.closest(".remove-subject");
      if (!button) return;
      if (subjectList.querySelectorAll(".subject-row").length <= 1) {
        message.textContent = "Keep at least one subject in the calculator.";
        return;
      }
      button.closest(".subject-row").remove();
      message.textContent = "";
    });

    document.querySelector("#calculate-gpa")?.addEventListener("click", () => {
      const rows = [...subjectList.querySelectorAll(".subject-row")];
      const entries = [];
      let invalid = false;
      rows.forEach((row) => {
        const input = row.querySelector(".mark-input");
        const raw = input.value.trim();
        const gradeEl = row.querySelector(".grade-result");
        const pointEl = row.querySelector(".point-result");
        if (raw === "") {
          gradeEl.textContent = "—";
          pointEl.textContent = "—";
          row.classList.add("row-incomplete");
          invalid = true;
          return;
        }
        const mark = Number(raw);
        if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
          gradeEl.textContent = "Invalid";
          pointEl.textContent = "—";
          row.classList.add("row-incomplete");
          invalid = true;
          return;
        }
        row.classList.remove("row-incomplete");
        const result = getGrade(mark);
        gradeEl.textContent = result.grade;
        pointEl.textContent = result.point.toFixed(2);
        entries.push({ mark, ...result });
      });
      if (invalid) {
        message.textContent = "Please enter a valid mark from 0 to 100 for every subject.";
        resultPanel.classList.remove("has-result");
        document.querySelector("#gpa-value").innerHTML = '—<small>/ 4.00</small>';
        document.querySelector("#subjects-count").textContent = "Complete all subject marks";
        document.querySelector("#overall-grade").textContent = "Overall grade: —";
        return;
      }
      const average = entries.reduce((sum, item) => sum + item.point, 0) / entries.length;
      const averageMark = entries.reduce((sum, item) => sum + item.mark, 0) / entries.length;
      const overall = getGrade(averageMark);
      document.querySelector("#gpa-value").innerHTML = `${average.toFixed(2)}<small>/ 4.00</small>`;
      document.querySelector("#subjects-count").textContent = `${entries.length} subject${entries.length === 1 ? "" : "s"} graded`;
      document.querySelector("#overall-grade").textContent = `Average-mark grade: ${overall.grade}`;
      resultPanel.classList.add("has-result");
      message.textContent = "Calculation complete. Check your institution’s official grading rules for confirmed results.";
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      document.querySelector("#contact-status").textContent = "Thanks! This demo form works locally, but it does not send messages to a real college inbox.";
      contactForm.reset();
    });
  }
});