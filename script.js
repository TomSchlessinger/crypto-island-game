let eth = 0.05//ether price in dollars, will fluctuate
let bal = 10//amount of money the player has/starts with
let crypto = 30//amount of eth the player owns/starts with
let nft_count = 0//amount of nfts the player owns, doesn't count tiers as another nft

let nft_array = []
let an_array = []

let arrow_price = [30, 15, 22.5, 30, 60]
let boat_price = [100, 50, 75, 100, 200]
let assassin_price = [500, 250, 375, 500, 1000]
let hacker_price = [2500, 1250, 1875, 2500, 5000]
let hero_price = [10000, 5000, 7500, 10000, 20000]

let arrow_tier = 0
let assassin_tier = 0
let boat_tier = 0
let hacker_tier = 0
let hero_tier = 0

let has_won = 0

function fluc(boost) {//how much eth fluctuates
  let fluc = Math.floor((Math.random() * 3 * (1 + boost * 0.02 + 0.07 * (boost == 5)) - 1.2) * 100) / 1000
  //console.log(fluc)
  return fluc
}
//buy function
function buy(price, bal, cryp, factor = 1) {//factor is how many bought/sold
  if (bal - (price * factor) < 0) {//0.03 is the multiplier
    return [bal, cryp];//returns balance and crypto gotten
  }
  return [bal - (price * factor), cryp + factor]
}


// sell function
function sell(price, bal, cryp, factor = 1) {
  if (cryp - factor < 0) {
    return [bal, cryp];//returns balance and crypto gotten
  }
  return [bal + price * factor, cryp - factor]
}

function crash(num, arrow_boost) {
  let factor = Math.floor((Math.random() * (0.4 * (1 + arrow_boost)) + 0.31) * 100) / 100
  return num *= factor
}

function rise(num, arrow_boost) {
  let factor = Math.floor((Math.random() * 0.32 * (1 + arrow_boost) + 0.39) * 100) / 100
  let finalnum = Math.floor(num * 100 / factor) / 100

  return finalnum
}

function should_fall(ether, boost_tier = 0) {
  shouldFall = Math.floor(Math.random() * 99 - 1)//numbers range btwn -1 and 99 so 100 different options; only 2 cause a large change -1: it crashes, 0: it rises, > 0: it stays the same 
  /*how the math for the random generator works: we want 100 different options which means -1 to 98(its 100 different options because -1 and 0 count as options meaning 2 + 98 different options which equals 100) because of Math.floor(), which rounds down to the nearest int, its effectively never going to become whats in its inputs if its given a random number. Because -1 is an option, we need to subtract 1, in order to be able to obtain -1. this makes the options theoretically -1 to 99(without the flooring) but because it is flooring, its effectively -1 to 98, which is what we're looking for*/
  if (boost_tier == 5) {
    switch (shouldFall) {
      case -1:
        return crash(ether, 0.01 * boost_tier)
      case 0:
        return rise(ether, 0.02 * boost_tier)
      case 1:
        return rise(ether, 0.02 * boost_tier)
    }
  }
  //console.log(shouldFall)
  if (boost_tier < 5) {
    switch (shouldFall) {
      case -1:
        return crash(ether, 0.005 * boost_tier)
      case 0:
        return rise(ether, 0.01 * boost_tier)
    }
  }
  return ether;
}

function buyNFT(bal, price, tier) {
  if (bal < price) {
    return [bal, tier]
  }
  if (tier == 5) {
    return [bal, tier]
  }
  return [bal - price, tier + 1]
}
function buyIsland(price, cryp, monkeys) {
  let finished = 0
  function isFinished(item) {
    finished += (item == 5)
  }
  monkeys.forEach(isFinished);
  //console.log(price >= 110)
  //console.log(cryp>= 100000)
  //console.log(finished)
  can_buy = (price >= 110 && cryp >= 100000 && finished == 5)
  if (can_buy) {
    return [cryp - 100000, 1]
  }
  return [cryp, 0]//returns 1 if the game is complete, returns 0 if the game is incomplete
}

setInterval(function() {
  a_number = Math.floor(Math.random() * 10)
  switch (a_number) {
    case 0:
      crypto += (hacker_tier > 0) * Math.random() * 101
      break
    case 1:
      crypto += (hacker_tier > 1) * Math.random() * 101
      break
    case 2:
      crypto += (hacker_tier > 2) * Math.random() * 101
      break
    case 3:
      crypto += (hacker_tier > 3) * Math.random() * 101
      break
    case 4:
      crypto += (hacker_tier > 4) * Math.random() * 101
      break
    case 5:
      crypto += (hacker_tier > 4) * Math.random() * 151
      break
  }
}, 10000)
setInterval(function() { eth += fluc(assassin_tier); if (eth < 0) { eth = 0 }; }, 300)
setInterval(function() {
  eth = should_fall(eth, arrow_tier);
  if (boat_tier < 5) {
    bal += 10 * boat_tier * (1 + hero_tier * 0.1 + 0.1 * (hero_tier == 5));
  }
}, 1000);

setInterval(function() {
  random_gen = Math.round(Math.random())
  random_num = Math.floor(Math.random() * (2000 / 3) + 1000)
  bal += (random_num) * random_gen * (boat_tier >= 5) * (1 + hero_tier * 0.1 + 0.1 * (hero_tier == 5))
}, 10000)

setInterval(function() {//this is the game loop
  document.getElementById("continue").onclick = function() {
    document.getElementById("win").style.display = "none"
    has_won = 0;
  }
  document.getElementById("cryptoland").onclick = function() {
    has_won_array = buyIsland(eth, crypto, [arrow_tier, boat_tier, assassin_tier, hacker_tier, hero_tier])
    crypto = has_won_array[0]
    console.log(has_won_array[1])
    has_won = has_won_array[1]
  }
  if (has_won == 0) {
    document.getElementById("cryptoland").innerHTML = "If each ETH is valued at $110+ and if you have all of the monkeys unlocked, you can buy cryptoland and win the game by paying 100,000"
  }
  if (has_won == 1) {
    document.getElementById("win").style.display = "inline-block"
    document.getElementById("cryptoland").style.display = "none"
  }

  if ((Math.round((eth * crypto + bal) * 100) / 100) >= 1000) {
    document.getElementById("buy_50").style.display = "inline-block"
    document.getElementById("sell_50").style.display = "inline-block"
  }
  if ((Math.round((eth * crypto + bal) * 100) / 100) >= 5000) {
    document.getElementById("buy_100").style.display = "inline-block"
    document.getElementById("sell_100").style.display = "inline-block"
  }
  if ((Math.round((eth * crypto + bal) * 100) / 100) >= 10000) {
    document.getElementById("buy_1000").style.display = "inline-block"
    document.getElementById("sell_1000").style.display = "inline-block"

  }
  if ((Math.round((eth * crypto + bal) * 100) / 100) >= 50000) {
    document.getElementById("buy_10000").style.display = "inline-block"
    document.getElementById("sell_10000").style.display = "inline-block"

  }

  document.getElementById("buy").onclick = function() {
    an_array = buy(eth, bal, crypto, 1)
    bal = an_array[0]
    crypto = an_array[1]
  }
  document.getElementById("buy_50").onclick = function() {
    an_array = buy(eth, bal, crypto, 50)
    bal = an_array[0]
    crypto = an_array[1]
  }
  document.getElementById("buy_100").onclick = function() {
    an_array = buy(eth, bal, crypto, 100)
    bal = an_array[0]
    crypto = an_array[1]
  }
  document.getElementById("buy_1000").onclick = function() {
    an_array = buy(eth, bal, crypto, 1000)
    bal = an_array[0]
    crypto = an_array[1]
  }
  document.getElementById("buy_10000").onclick = function() {
    an_array = buy(eth, bal, crypto, 10000)
    bal = an_array[0]
    crypto = an_array[1]
  }

  document.getElementById("sell").onclick = function() {
    an_array = sell(eth, bal, crypto, 1)
    bal = an_array[0]
    crypto = an_array[1]
  }
  document.getElementById("sell_50").onclick = function() {
    an_array = sell(eth, bal, crypto, 50)
    bal = an_array[0]
    crypto = an_array[1]
  }
  document.getElementById("sell_100").onclick = function() {
    an_array = sell(eth, bal, crypto, 100)
    bal = an_array[0]
    crypto = an_array[1]
  }
  document.getElementById("sell_1000").onclick = function() {
    an_array = sell(eth, bal, crypto, 1000)
    bal = an_array[0]
    crypto = an_array[1]
  }
  document.getElementById("sell_10000").onclick = function() {
    an_array = sell(eth, bal, crypto, 10000)
    bal = an_array[0]
    crypto = an_array[1]
  }

  document.getElementById("arrow_text").onclick = function() {
    nft_array = buyNFT(crypto, arrow_price[arrow_tier], arrow_tier)
    crypto = nft_array[0]
    arrow_tier = nft_array[1]
  }
  document.getElementById("boat_text").onclick = function() {
    nft_array = buyNFT(crypto, boat_price[boat_tier], boat_tier)
    crypto = nft_array[0]
    boat_tier = nft_array[1]
  }
  document.getElementById("assassin_text").onclick = function() {
    nft_array = buyNFT(crypto, assassin_price[assassin_tier], assassin_tier)
    crypto = nft_array[0]
    assassin_tier = nft_array[1]
  }
  document.getElementById("hacker_text").onclick = function() {
    nft_array = buyNFT(crypto, hacker_price[hacker_tier], hacker_tier)
    crypto = nft_array[0]
    hacker_tier = nft_array[1]
  }
  document.getElementById("hero_text").onclick = function() {
    nft_array = buyNFT(crypto, hero_price[hero_tier], hero_tier)
    crypto = nft_array[0]
    hero_tier = nft_array[1]
  }

  nft_count = (arrow_tier > 0) + (hero_tier > 0) + (hacker_tier > 0) + (assassin_tier > 0) + (boat_tier > 0)//js bools share values as integers: 1 = true, 0 = false. if x monkey's tier > 0, it is bought, meaning we can check if its tier > 0 and it will return 1 if it is, and 0 if it isnt. meaning we can add 5 of these and for each one that is true , it will increase the value by +1

  //setting the values in the html 
  document.getElementById("buy").innerHTML = "Buy One ETH for $" + Math.round(eth * 100) / 100
  document.getElementById("sell").innerHTML = "Sell One ETH for $" + Math.round(eth * 100) / 100
  document.getElementById("crypto").innerHTML = "Your Current Crypto Wallet: " + Math.round(crypto * 100) / 100 + "ETH"
  document.getElementById("balance").innerHTML = "Your Current Balance: $" + Math.round(bal * 100) / 100
  document.getElementById("cryptoBalance").innerHTML = "Your Current Crypto Balance: $" + Math.round(eth * crypto * 100) / 100
  document.getElementById("totalBalance").innerHTML = "Your Current Total Balance: $" + (Math.round((eth * crypto + bal) * 100) / 100)
  document.getElementById("totalNFTs").innerHTML = "Your Current NFT Count: " + nft_count

  if (arrow_tier < 5) {
    document.getElementById("arrow_text").innerHTML = "Buy Arrow Monkey Tier " + (arrow_tier + 1) + " for " + arrow_price[arrow_tier] + " ETH <button class='nfts' id='arrow'></button>"
  }
  else if (arrow_tier == 5) {
    document.getElementById("arrow_text").innerHTML = "Arrow Monkey Max Tier(Tier5) <button class='nfts' id='arrow'></button>"
  }
  if (boat_tier < 5) {
    document.getElementById("boat_text").innerHTML = "Buy Boat Monkey Tier " + (boat_tier + 1) + " for " + boat_price[boat_tier] + " ETH <button class='nfts' id='boat'></button>"
  }
  else if (boat_tier == 5) {
    document.getElementById("boat_text").innerHTML = "Boat Monkey Max Tier(Tier5) <button class='nfts' id='boat'></button>"
  }
  if (assassin_tier < 5) {
    document.getElementById("assassin_text").innerHTML = "Buy Assassin Monkey Tier " + (assassin_tier + 1) + " for " + assassin_price[assassin_tier] + " ETH <button class='nfts' id='assassin'></button>"
  }
  else if (assassin_tier == 5) {
    document.getElementById("assassin_text").innerHTML = "Assassin Monkey Max Tier(Tier5) <button class='nfts' id='assassin'></button>"
  }
  if (hacker_tier < 5) {
    document.getElementById("hacker_text").innerHTML = "Buy Hacker Monkey Tier " + (hacker_tier + 1) + " for " + hacker_price[hacker_tier] + " ETH <button class='nfts' id='hacker'></button>"
  }
  else if (hacker_tier == 5) {
    document.getElementById("hacker_text").innerHTML = "Hacker Monkey Max Tier(Tier5) <button class='nfts' id='hacker'></button>"
  }
  if (hero_tier < 5) {
    document.getElementById("hero_text").innerHTML = "Buy Hero Monkey Tier " + (hero_tier + 1) + " for " + hero_price[hero_tier] + " ETH <button class='nfts' id='hero'></button>"
  }
  else if (hero_tier == 5) {
    document.getElementById("hero_text").innerHTML = "Hero Monkey Max Tier(Tier5) <button class='nfts' id='hero'></button>"
  }

})