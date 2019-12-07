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

// Declare variables for user, dealer and deck
let user, dealer, deck;

// Start new game
function new_game() {
  // Remove 'start game' button
  document.querySelector('.btn.start').remove();

  // Create objects for user, dealer and deck
  deck = new OneDeck();
  user = new Player();
  dealer = new Player('dealer');

  // Mix deck
  deck.mix();

  // Add 'table' (user's and dealer's hands)
  document.querySelector('main').insertAdjacentHTML('afterbegin', `
  <div class="dealer-hand">Dealer:</div>
  <div class="dealer-score">Score:</div>
  <div class="user-hand">Player:</div>
  <div class="user-score">Score:</div>`);

  // Dealing
  dealing_cards();
}


// Dealing cards
function dealing_cards() {
  // Process of dealing cards
  setTimeout( () => dealer_getCard(), 1000);
  setTimeout( () => user_getCard(), 2000);
  setTimeout( () => dealer_getCard(), 3000);
  setTimeout( () => user_getCard(), 4000);

  // Add button 'take card' and 'stand'
  setTimeout( () => document.querySelector('.dealer-score').insertAdjacentHTML('afterend', `
  <div class="btn" onclick="user_getCard()">Take card</div>
  <div class="btn" onclick="check(dealer_getCard)">Stand</div>`), 5000);
}


// User's 'get card' handler
function user_getCard() {
  let card = deck.get_card;
  user.hand.push(card);
  document.querySelector('.user-hand').textContent += ` ${card.name}`;
  document.querySelector('.user-score').textContent = `Score: ${user.get_score()}`;
  if (user.get_score() > 21) {
    setTimeout( () => alert('You lose!'), 500);
    setTimeout( () => restart(), 2000);
  }
}


// Dealer's 'get card' handler
function dealer_getCard() {
  let card = deck.get_card;
  dealer.hand.push(card);
  // Dealer's hand and score
  document.querySelector('.dealer-hand').textContent += ` ${card.name}`;
  document.querySelector('.dealer-score').textContent = `Score: ${dealer.get_score()}`;
}

// Compare function. p1 - user's score, p2 - dealer's score
function win_lose(p1, p2) {
  return (p2 > 21) ? alert('You win!') : (p1 > p2) ? alert('You win!') : (p1 == p2) ? alert('Push') : alert('You lose');
}


// Check function (simulation of dealer's 'take card' process)
function check(dealer_getCard) {
  let dealer_score = dealer.get_score();
  let user_score = user.get_score();
  if (dealer_score > user_score)  {
    setTimeout( () => win_lose(user_score, dealer_score), 500);
  }
  else {
    // Very simple logic: the dealer stops taking cards after 16 points
    while (dealer_score < 16) {
      dealer_getCard();
      dealer_score = dealer.get_score();
    }
    // Return result of game
    setTimeout( () => win_lose(user_score, dealer_score), 500);
  }
  // Start new game
  return setTimeout( () => restart(), 2000);
}


// Restart game
function restart() {
  // Remove all table elements
  let table = document.querySelectorAll('div');
  for (let el of table) {
    el.remove();
  }

  // Add 'start game' button
   document.querySelector('main').insertAdjacentHTML('afterbegin', `
   <div class="btn start" onclick="new_game()">Start Game</div>`);
}
