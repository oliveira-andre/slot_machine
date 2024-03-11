document.addEventListener("DOMContentLoaded", function() {
  const items = [
    "𝟳",
    "🍒",
    "💵",
    "🍎"
  ];

  document.querySelector(".info").textContent = items.join(" ");

  const doors = document.querySelectorAll(".door");
  const spinner = document.querySelector("#spinner");

  spinner.addEventListener("click", spin);

  async function spin() {
    document.querySelector('h2').textContent = '🎰 GOOD LUCK! 🎰';
    pullLeverAnimation(spinner);
    init();
    init(false, 1, 2);

    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);

      boxes.style.transform = "translateY(0)";

      await new Promise(resolve => setTimeout(resolve, duration * 100));
    };
  };

  function pullLeverAnimation(lever) {
    playSound('lever');
    if (screen.width < 1000) {
      lever.style.animation = 'pullLeverMobile 0.6s ease';
    } else {
      lever.style.animation = 'pullLever 0.6s ease';
    }
        
    // xReset animation for subsequent clicks
    lever.addEventListener('animationend', () => {
        lever.style.animation = '';
    });
  }

  function playSound(sound) {
    switch (sound) {
        case 'lever':
          var audio = document.getElementById('lever_sound');
          audio.play();
          break;
        case 'selection':
          var audio = document.getElementById('selection_sound');
          audio.play();
          break;          
    }
  }

  function init(firstInit = true, groups = 1, duration = 1) {
    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = "0";
      } else if (door.dataset.spinned === "1") {
        return;
      };

      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);

      const pool = ["❓"];
      
      if (!firstInit) {
        const arr = [];

        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        };

        pool.push(...shuffle(arr));

        boxesClone.addEventListener("transitionstart", function() {
          door.dataset.spinned = "1";

          this.querySelectorAll(".box").forEach((box) => {
            box.style.filter = "blur(1px)";
          });
        }, { once: true });

        boxesClone.addEventListener("transitionend", function() {
          playSound('selection');
          this.querySelectorAll(".box").forEach((box, index) => {
            box.style.filter = "blur(0)";

            if (index > 0) this.removeChild(box);
          });


          playSound('selection');
          checkResult(this);
        }, { once: true });
      };

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      };

      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
          door.clientHeight * (pool.length - 1)
        }px)`;

      door.replaceChild(boxesClone, boxes);
    };
  };

  function shuffle([...arr]) {
    let m = arr.length;

    while(m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    };

    return arr;
  };

  function checkResult(boxe) {
    const boxes = document.querySelectorAll(".boxes");
    const result = [];
    boxes.forEach((box) => {
      result.push(box.textContent);
    });

    const win = result.every((val, i, arr) => val === arr[0]);

    if (win) {
      document.querySelector('h2').textContent = 'YOU WIN!';
    } else {
      document.querySelector('h2').textContent = 'YOU LOOSE!';
    }
  };

  init();
});
