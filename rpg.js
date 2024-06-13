let health = 100;
let gold = 50;
let xp = 0;
let fighting = 0;
let monsterHealth = 15;
let inventory =['stick'];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

const weapons = [
  { name:'stick', power: 5},
  {name:"dagger", power: 30},
  {name:"claw hammer", power: 50},
  {name:"sword", power: 100}
]

const monsters = [
  {name: "Slime", level: 2, health: 15},
  {name: "Fanged Beast", level: 8, health: 60},
  {name: "Dragon", level: 20, health: 300}
]

const locations = [
  {
    name: "0.store", 
    text: "You enter the store.", 
    buttonText: ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"], 
    buttonFunction: [buyHealth, buyWeapon, goTown]
  },
  {
    name: "1.town", 
    text: 'You are in the town square. You see a sign that says "Store".', 
    buttonText: ["Go to store", "Go to cave", "Fight dragon"], 
    buttonFunction: [goStore, goCave, fightDragon]
  },
  {
    name: "2.cave", 
    text: "You enter the cave. You see some monsters.", 
    buttonText: ["Fight slime", "Fight fanged beast", "Go to town square"], 
    buttonFunction: [fightSlime, fightBeast, goTown]
  },
  {
    name: "3.monster", 
    text: "You are fighting a monster.", 
    buttonText: ["Attack", "Dodge", "Run"], 
    buttonFunction: [attack, dodge, goTown]
  },
  {
    name: "4.defeatMonster", 
    text: "The monster screams \"Arg!\" as it dies. You gain experience points and find gold.",
    buttonText: ["Go to town square.", "Go to town square.", "Go to town square."], 
    buttonFunction: [goTown, goTown, easterEgg]
  },
  {
    name: "5.loseGame", 
    text: "You die. ☠",
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"], 
    buttonFunction: [restart, restart, restart]
  },
  {
    name: "6.winGame", 
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉",
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"], 
    buttonFunction: [restart, restart, restart]
  },
  {
    name: "7.easterEgg", 
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
    buttonText: ["Pick 2", "Pick 8", "Go to town square?"], 
    buttonFunction: [pickTwo, pickEight, goTown]
  }
]

function update(location) {
  monsterStats.style.display = "none";
  text.innerText = location.text;
  button1.innerText = location.buttonText[0];
  button2.innerText = location.buttonText[1];
  button3.innerText = location.buttonText[2];
  button1.onclick = location.buttonFunction[0];
  button2.onclick = location.buttonFunction[1];
  button3.onclick = location.buttonFunction[2];
}

function goStore() {
  update(locations[0]);
}

function goTown() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function fightSlime() {
  fighting = 0;
  goFight(monsters[fighting]);
}

function fightBeast() {
  fighting = 1;
  goFight(monsters[fighting]);
}

function fightDragon() {
  fighting = 2;
  goFight(monsters[fighting]);
}

function goFight(monster) {
  update(locations[3]);
  monsterStats.style.display = "block";
  monsterName.innerText = monster.name;
  monsterHealthText.innerText = monster.health;
  monsterHealth = monster.health;
}

function monsterAttackValue(monster) {
  const hit = (monster.level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function attack() {
  let currentWeapon = inventory[inventory.length-1];
  let currentWeaponPower = 0;
  
  for (const weapon of weapons) {
    if (currentWeapon === weapon.name) {
      currentWeaponPower = weapon.power;
    }
  }

  if (Math.random() > .2 || health < 20) {
    text.innerText = "The "+monsters[fighting].name +" attacks. You attack it with your "+inventory[inventory.length-1]+".";
    monsterHealth -= currentWeaponPower + Math.floor(Math.random() * xp) + 1;
    monsterHealthText.innerText = monsterHealth;
    console.log(monsterHealth);
    health -= monsterAttackValue(monsters[fighting]);
    healthText.innerText = health;
  } else {
    text.innerText = "The "+monsters[fighting].name +" attacks. You attack it with your "+inventory[inventory.length-1]+". You miss.";
    health -= monsterAttackValue(monsters[fighting]);
    healthText.innerText = health;
  }
  checkLoseGame();
  if (monsterHealth <= 0) {
    if (fighting === 2){
      winGame();
    } else {
      defeatMonster();
    }
  }  
}

function checkLoseGame() {
  if (health <= 0) {
    healthText.innerText = 0;
    update(locations[5]);
  }
}

function dodge() {
  text.innerText = "You dodge the attack from the slime.";
}

function defeatMonster() {
  monsterHealthText.innerText = 0;
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
  checkLoseGame();
}

function buyHealth() {
  if (gold < 10) {
    text.innerText = "You do not have enough gold to buy health.";
  } else {
    health += 10;
    gold -= 10;
    healthText.innerText = health;
    goldText.innerText = gold;
  }
}

function buyWeapon() {
  let currentWeapon = inventory[inventory.length - 1];
  if (inventory.find(weapon => weapon === 'sword')){
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  } else if (gold >= 30) {
    gold -=30;
    goldText.innerText = gold;
    for (let i = 0; i < weapons.length; i++) {
      if (currentWeapon === weapons[i].name) {
        inventory.push(weapons[i+1].name);
        text.innerText = "You now have a " + inventory[inventory.length - 1] +". In your inventory you have: "+ inventory + ".";
      } 
    }
  } else if (gold <= 30){
    text.innerText = "You do not have enough gold to buy a weapon.";
  }
}

function sellWeapon() {
  if (inventory.length === 1){
    text.innerText = "Don't sell your only weapon!";
  } else {
    gold +=15;
    goldText.innerText = gold;
    text.innerText = "You sold a "+inventory.shift()+". In your inventory you have: " + inventory+".";
  }
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  inventory =['stick'];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(number) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }

  text.innerText = "You picked "+number+". Here are the random numbers:";
  for (let i = 0; i < 10; i++) {
    text.innerText += "\n"+numbers[i];
  }
  if (numbers.includes(number)) {
    text.innerText += "\nRight! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "\nWrong! You lose 30 health!";
    health -= 30;
    healthText.innerText = health;
    checkLoseGame();
  }
}