'use strict'

// Create normal deck with 52 cards
class OneDeck {
  constructor() {
    // Array for cards
    this.arr = [];
    // array from names for one card
    let names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    // array from suits for one card
    let suits = ['heart', 'diamond', 'club', 'spade'];
    // constructor for one card
    function create_card(n, s, val, val1) {
      this.name = n;
      this.suit = s;
      this.value = val;
      // card 'A' has two values
      if (val1) this.value1 = val1;
    }
    // Process of card's creation
    for (let n of names) {
      for (let s of suits) {
        if (+n >= 2 || +n <=10) {
          let val = +n;
          this.arr.push(new create_card(n, s, val))
        }
        if (n == 'J' || n == 'Q' || n == 'K') {
          let val = 10;
          this.arr.push(new create_card(n, s, val))
        }
        if (n == 'A') {
          let val = 11;
          let val1 = 1;
          this.arr.push(new create_card(n, s, val, val1))
        }
      }
    }
  }

  // Mix cards in the deck
  mix() {
    this.arr = this.arr.sort( function() { return Math.random() - 0.5});
  }

  // Get the random card from deck
  get get_card() {
    // Function of random integer in a given range (without max)
    function getRandom(min, max) {
      return Math.floor(Math.round(min) + Math.random() * (Math.floor(max) - Math.round(min)));
    }
    // Get random number
    let rand_num = getRandom(0, this.arr.length);
    // Get random card
    let card = this.arr[rand_num];
    // Delete this card from the deck
    this.arr.splice(rand_num, 1);
    return card;
  }

}

// Player's model
class Player {
  constructor(name) {
    //his name
    if (!(name)) this.name = 'Player'
    else this.name = name;
    // and hand
    this.hand = [];
  }

  // Return the score of hand
  get_score() {
    // For 'A'. If 'A' wasn't first in this hand --->
    let set = new Set();
    // Sum of cards values
    return this.hand.reduce( function(score, card) {
      if (card.name == 'A') {
        //-----> his value will be 1
        if (set.has(card.name)) return score + card.value1;
        else {
          //else his value will be 11
          set.add(card.name);
          return score + card.value;
        }
      }
      else return score + card.value;
    }, 0 )
  }
}

// Create two player's and deck
let deck = new OneDeck();
let user = new Player();
let dealer = new Player('dealer');

// Mix deck
deck.mix();

// First card to dealer
let card = deck.get_card;
dealer.hand.push(card);
document.querySelector('.dealer-hand').textContent += ` ${card.name}`;
document.querySelector('.dealer-score').textContent = `Score: ${dealer.get_score()}`;
// Player's score
document.querySelector('.user-score').textContent = `Score: ${user.get_score()}`;

// Get card handler
function getCard() {
  let card = deck.get_card;
  user.hand.push(card);
  document.querySelector('.user-hand').textContent += ` ${card.name}`;
  document.querySelector('.user-score').textContent = `Score: ${user.get_score()}`;
  if (user.get_score() > 21) {
    setTimeout( () => alert('You lose!'), 500);
    setTimeout( () => new_game(), 2000);
  }
}

// Compare function (argument of check() function). p1 - user's score, p2 - dealer's score
function win_lose(p1, p2) {
  return (p2 > 21) ? alert('You win!') : (p1 > p2) ? alert('You win!') : (p1 == p2) ? alert('Push') : alert('You lose');
}

// Check function (simulation of dealer's 'get card' process)
function check(win_lose, new_game) {
  let dealer_score = dealer.get_score();
  let user_score = user.get_score();
  if (dealer_score > user_score)  {
    setTimeout( () => win_lose(user_score, dealer_score), 500);
  }
  else {
    // Very simple logic: the dealer stops taking cards after 16 points
    while (dealer_score < 16) {
      let card = deck.get_card;
      dealer.hand.push(card);
      document.querySelector('.dealer-hand').textContent += ` ${card.name}`;
      document.querySelector('.dealer-score').textContent = `Score: ${dealer.get_score()}`;
      dealer_score = dealer.get_score();
    }
    // Return result of game
    setTimeout(() => win_lose(user_score, dealer_score), 500);
  }
  // Start new game
  return setTimeout( () => new_game(), 2000);
}

// Create new game
function new_game() {
  user.hand = [];
  dealer.hand = [];

  deck = new OneDeck();

  deck.mix();

  document.querySelector('.user-hand').textContent = `Player: `;
  document.querySelector('.dealer-hand').textContent = `Dealer: `;
  // First card to dealer
  let card = deck.get_card;
  dealer.hand.push(card);
  document.querySelector('.dealer-hand').textContent += ` ${card.name}`;
  document.querySelector('.dealer-score').textContent = `Score: ${dealer.get_score()}`;
  // Player's score (set "zero")
  document.querySelector('.user-score').textContent = `Score: ${user.get_score()}`;
}
