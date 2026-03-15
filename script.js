// Format VND và làm tròn lên
function formatVND(value) {
    const rounded = Math.ceil(value);
    return rounded.toLocaleString("vi-VN") + " ₫";
  }
  
  function createPlayerRow(index, name = "", hours = "1", minutes = "0") {
    const row = document.createElement("div");
    row.className = "player-row";
    row.dataset.index = index;
  
    // Tên
    const nameWrap = document.createElement("div");
    nameWrap.className = "input-wrapper player-name-wrapper";
    const nameIcon = document.createElement("span");
    nameIcon.className = "player-prefix";
    nameIcon.textContent = "👤";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Tên người chơi";
    nameInput.value = name;
    nameInput.addEventListener("input", () => (row.dataset.name = nameInput.value));
    nameWrap.appendChild(nameIcon);
    nameWrap.appendChild(nameInput);
  
    // Giờ
    const hourWrap = document.createElement("div");
    hourWrap.className = "input-wrapper time-input";
    const hourIcon = document.createElement("span");
    hourIcon.className = "time-prefix";
    hourIcon.textContent = "Giờ";
    const hourInput = document.createElement("input");
    hourInput.type = "number";
    hourInput.inputMode = "numeric";
    hourInput.pattern = "[0-9]*";
    hourInput.placeholder = "0";
    hourInput.value = hours;
    hourInput.addEventListener("input", () => (row.dataset.hours = hourInput.value));
    hourWrap.appendChild(hourIcon);
    hourWrap.appendChild(hourInput);
  
    // Phút
    const minWrap = document.createElement("div");
    minWrap.className = "input-wrapper time-input";
    const minIcon = document.createElement("span");
    minIcon.className = "time-prefix";
    minIcon.textContent = "Phút";
    const minInput = document.createElement("input");
    minInput.type = "number";
    minInput.inputMode = "numeric";
    minInput.pattern = "[0-9]*";
    minInput.placeholder = "0";
    minInput.value = minutes;
    minInput.addEventListener("input", () => (row.dataset.minutes = minInput.value));
    minWrap.appendChild(minIcon);
    minWrap.appendChild(minInput);
  
    // Nút xóa
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      row.remove();
    });
  
    row.appendChild(nameWrap);
    row.appendChild(hourWrap);
    row.appendChild(minWrap);
    row.appendChild(removeBtn);
  
    // Lưu data ban đầu
    row.dataset.name = name;
    row.dataset.hours = hours;
    row.dataset.minutes = minutes;
  
    return row;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const totalBillInput = document.getElementById("totalBill");
    const totalHoursInput = document.getElementById("totalHours");
    const playersContainer = document.getElementById("playersContainer");
    const addPlayerBtn = document.getElementById("addPlayerBtn");
    const calculateBtn = document.getElementById("calculateBtn");
    const errorBox = document.getElementById("errorBox");
    const resultCard = document.getElementById("resultCard");
    const resultChip = document.getElementById("resultChip");
    const resultPlayers = document.getElementById("resultPlayers");
    const resultTotal = document.getElementById("resultTotal");
  
    // Khởi tạo 2 người mặc định
    playersContainer.appendChild(createPlayerRow(0, "Người A", "1", "0"));
    playersContainer.appendChild(createPlayerRow(1, "Người B", "1", "0"));
  
    addPlayerBtn.addEventListener("click", () => {
      const currentCount = playersContainer.querySelectorAll(".player-row").length;
      const name = `Người ${String.fromCharCode(65 + currentCount)}`; // A, B, C, ...
      playersContainer.appendChild(createPlayerRow(currentCount, name, "1", "0"));
    });
  
    calculateBtn.addEventListener("click", () => {
      errorBox.style.display = "none";
      errorBox.textContent = "";
      resultCard.style.display = "none";
      resultPlayers.innerHTML = "";
      resultTotal.textContent = "";
  
      const totalBill = parseFloat(totalBillInput.value);
      const totalHours = parseFloat(totalHoursInput.value);
  
      if (isNaN(totalBill) || totalBill <= 0) {
        errorBox.textContent = "Vui lòng nhập Tổng tiền bill > 0.";
        errorBox.style.display = "block";
        return;
      }
      if (isNaN(totalHours) || totalHours <= 0) {
        errorBox.textContent = "Vui lòng nhập Tổng số giờ > 0.";
        errorBox.style.display = "block";
        return;
      }
  
      const rows = Array.from(playersContainer.querySelectorAll(".player-row"));
      const validPlayers = [];
  
      rows.forEach((row) => {
        const name = row.dataset.name || "";
        const hours = parseFloat(row.dataset.hours || "0");
        const minutes = parseFloat(row.dataset.minutes || "0");
        const totalMin = hours * 60 + minutes;
  
        if (name.trim() !== "" && totalMin > 0) {
          validPlayers.push({ name, hours, minutes, totalMin });
        }
      });
  
      if (validPlayers.length === 0) {
        errorBox.textContent = "Vui lòng nhập ít nhất 1 người có tên và thời gian > 0.";
        errorBox.style.display = "block";
        return;
      }
  
      const tableTotalMinutes = totalHours * 60;
      const perPlayer = [];
      let sumRounded = 0;
  
      validPlayers.forEach((p) => {
        const rawCost = (p.totalMin / tableTotalMinutes) * totalBill;
        const roundedCost = Math.ceil(rawCost); // làm tròn lên từng người
        sumRounded += roundedCost;
        perPlayer.push({ ...p, cost: roundedCost });
      });
  
      // Hiển thị kết quả
      resultChip.textContent = `Tổng bill ${formatVND(totalBill)} • ${totalHours} giờ`;
  
      perPlayer.forEach((p) => {
        const line = document.createElement("div");
        line.className = "result-line";
  
        const nameSpan = document.createElement("span");
        nameSpan.className = "result-name";
        nameSpan.textContent = `${p.name} (${p.hours}h ${p.minutes}p)`;
  
        const valueSpan = document.createElement("span");
        valueSpan.className = "result-value";
        valueSpan.textContent = formatVND(p.cost);
  
        line.appendChild(nameSpan);
        line.appendChild(valueSpan);
        resultPlayers.appendChild(line);
      });
  
      resultTotal.textContent = formatVND(sumRounded);
      resultCard.style.display = "block";
    });
  });