(function App() {
  const $users = document.getElementById('users');

  const createUserElement = (name, userColor) => {
    const $div = document.createElement('div');

    $div.className = 'user';
    $div.title = name;
    $div.innerHTML = name.split(' ').slice(0, 3).map(i => i[0]).join(' ');
    $div.style.color = userColor.isLight ? 'black' : 'white';
    $div.style.backgroundColor = userColor.color;

    return $div;
  };

  // fetch('https://uinames.com/api/?amount=100')
  fetch('users.json')
    .then(res => res.json())
    .then(res => {
      for (let i = res.length - 1; i >= 0; i--) {
        const user = res[i];
        const name = (`${user.name} ${user.surname}`).trim();
        const userColor = window.uniqolor(name, {
          saturation: i * 0.9,
          lightness: i,
        });

        $users.append(createUserElement(name, userColor));
      }
    });
}());

