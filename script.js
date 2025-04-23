function goToResult() {
    const birthday = document.getElementById("birthday").value;
    if (!birthday) {
      alert("Please enter your birthday!");
      return;
    }
    window.location.href = `result.html?birthday=${birthday}`;
  }
  