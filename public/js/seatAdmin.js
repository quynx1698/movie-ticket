function changeTime(movie) {
  let showtimeDate = document.getElementById("showtimeDate");
  let showtimeTime = document.getElementById("showtimeTime");
  let seatPlace = document.getElementById("seatPlace");

  let seatLine = ["F", "E", "D", "C", "B", "A"];
  let seatlineArr = [];
  let seatType = "";
  for (let i = 0; i < seatLine.length; i++) {
    seatType = "";

    let seat = movie.showtime[showtimeDate.value][showtimeTime.value];
    let seatL = seat[seatLine[i]].map((x, index) => {
      if (x)
        return `<label class="seat"><input type="checkbox" name="seat" value="${
          seatLine[i] + index
        }" /><span class="checkmark"></span></label>`;
      else
        return `<label class="seat"><input type="checkbox" name="seat" value="${
          seatLine[i] + index
        }" checked /><span class="checkmark"></span></label>`;
    });

    if (i == 0) seatType = h5("Ghế thường");
    else if (i == 2) seatType = h5("Ghế cao cấp");
    else if (i == 4) seatType = h5("Ghế bạch kim");

    seatlineArr.push(
      `${seatType}<div class="row justify-content-center mb-6">${seatL.join(
        ""
      )}</div>`
    );
  }
  seatPlace.innerHTML = seatlineArr.join("");
}

function changeDate(movie) {
  let showtimeDate = document.getElementById("showtimeDate");
  let showtimeTime = document.getElementById("showtimeTime");

  let timeArr = Object.keys(movie.showtime[showtimeDate.value]);
  let timeOpt = timeArr.map((x) => `<option value="${x}">${x}</option>`);
  showtimeTime.innerHTML = timeOpt.join("");
  changeTime(movie);
}

function h5(seatType) {
  return `<h5 class="my-5 font-weight-normal">${seatType}</h5>`;
}
