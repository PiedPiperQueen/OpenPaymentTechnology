
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Mini App</title>
    <style>
      body {
        margin: 0;
        padding: 1em;
        background-color: white;
      }
     
      [data-cart-info],
      [data-credit-card] {
        transform: scale(0.78);
        margin-left: -3.4em;
      }

      [data-cc-info] input:focus,
      [data-cc-digits] input:focus {
        outline: none;
      }

      .mdc-card__primary-action,
      .mdc-card__primary-action:hover {
        cursor: auto;
        padding: 20px;
        min-height: inherit;
      }
     
      [data-credit-card] [data-card-type] {
        transition: width 1.5s;
        margin-left: calc(100% - 130px)
      }

    [data-credit-card].is-visa {
        background: linear-gradient(135deg, #622774 0%, #c53364 100%);
      }

      [data-credit-card].is-mastercard {
        background: linear-gradient(135deg, #65799b 0%, #5e2563 100%);
      }

      .is-visa [data-card-type],
      .is-mastercard [data-card-type] {
        width: auto;
      }

      input.is-invalid,
      .is-invalid input {
        text-decoration: line-through;
      }

      ::placeholder {
        color: #fff;
      }
     
      [data-cart-info] span {
        display: inline-block;
        vertical-align: middle;
      }
     
      span.material-icons {
        font-size: 150px;
      }
     
      [data-credit-card] {
        width: 435px;
        min-height: 240px;
        border-radius: 10px;
        background-color: #5d6874;
      }
     
      [data-card-type] {
        display: block;
        width: 120px;
        height: 60px;
      }
     
      [data-cc-digits] {
        margin-top: 2em;
      }
     
      [data-cc-digits] input {
        color: white;
        font-size: 2em;
        line-height: 2em;
        border: none;
        background: none;
        margin-right: 0.5em
      }
     
      [data-cc-info] {
        margin-top: 1em;
      }
     
      [data-cc-info] input {
        color: white;
        font-size: 1.2em;
        border: none;
        background: none;
      }
     
      [data-cc-info] input:last-of-type {
        padding-right: 10px;
        float: right;
      }
     
      [data-pay-btn] {
        position: fixed;
        width: 90%;
        border: 1px solid;
        bottom: 20px;
      }
     
    </style>
  </head>
  <body>
    <div data-cart-info >
      <h1 class="mdc-typography--headline4">
        <span class="material-icons">shopping_cart</span>
        <span data-bill></span>
      </h1>
    </div>
    <div data-credit-card class="mdc-card mdc-card--outline">
      <div class="mdc-card__primary-action">
        <img  data-card-type src="https://placehold.it/120x60.png?text=Card"  alt="credit-card">
        <div data-cc-digits>
          <input type="text" size=4 placeholder="----">
          <input type="text" size=4 placeholder="----">
          <input type="text" size=4 placeholder="----">
          <input type="text" size=4 placeholder="----">
        </div>
         
        <div data-cc-info>
              <input type="text" size=20 placeholder="Name Surname">
              <input type="text" size=6 placeholder="MM/YY" name="expire-date">
        </div>
      </div>
    </div>
    <div>
      <button class="mdc-button"  data-pay-btn>Pay &amp Checkout Now</button>
    </div>
    <script>
      const appState = {};
      const formatAsMoney = (amount, buyerCountry) => {
      for (let i = 0; i < countries.length; i++) {
        if (countries[i].country === buyerCountry){
          const code = countries[i].code;
          const currency = countries[i].currency;
          return amount.toLocaleString(code, {
            style: "currency", currency: currency
          });
        }else {
          const code = "US";
          const cuurency = "USD";
          return amount.toLocaleString(code, {
            style: "currency", currency: currency
          });
        }
      }
      };
     
      const flagIfInvalid = (field, isValid) => {
        field.classList.toggle("is-invalid", !isValid);
      };
     
      const expiryDateFormatIsValid = target => {
        const regex = RegExp("(0[0-9]|10|11|12)/[0-9]{2}$");
        return regex.test(target.value);
      };
     
//Detect Card Function
     
      const detectCardType = ({target}) => {
        const input = target.value;
        const creditCard = document.querySelector("div[data-credit-card]");
        const cardTypeImg = document.querySelector("img[data-card-type]");
        if (input.startsWith("4")) {
          creditCard.classList.remove("is-mastercard");
          creditCard.classList.add("is-visa");
          cardTypeImg.src = supportedCards.visa;
          return "is-visa";
        } else if (input.startsWith("5")){
          creditCard.classList.remove("is-visa");
          creditCard.classList.add("is-mastercard");
          cardTypeImg.src = supportedCards.mastercard;
          //console.log("is-mastercard");
          return "is-mastercard";
        }
      };
     
      const validateCardExpiryDate = ({target}) => {
        const now = new Date();
        const thisYear = `${now.getFullYear()}`.slice(-2);
        const isFuture = thisYear < target.value.slice(-2);
        const isValid = expiryDateFormatIsValid(target) && isFuture;
        flagIfInvalid(target, isValid);
        return isValid;
      };
     
      const validateCardHolderName = ({target}) => {
        console.log("here");
        const regex = RegExp("[A-Z]{1}[a-z ]{3,}[A-Z]{1}[a-z]{3,}");
        const isValid = regex.test(target.value);
        flagIfInvalid(target, isValid);
        return isValid;
      };
     
      const validateWithLuhn = (digits) => {
        if (digits.length !== 16) {
          return false;
        }
        for (let i = digits.length - 2; i >= 0; i-=2) {
          let digit = digits[i]*2;
          if (digit > 9) {
            digit -= 9;
          }
          console.log(digit, i);
          digits[i] = digit;
        };
        const sum = digits.reduce((accumulator, index) => accumulator + Number(index));
        console.log(sum, digits);
        return sum && sum % 10 === 0;
      }
     
      const validateCardNumber = () => {
        const cardNumber = document.querySelectorAll("div[data-cc-digits] input");
        let inputs = [];
        let index = 0;
        while(index < 4) {
          let input = cardNumber[index++].value;
          inputs.push(input.split(""));
        }
        const digits = inputs.flat();
        const isValid = validateWithLuhn(digits);
        const target = document.querySelector("div[data-cc-digits]");
        flagIfInvalid(target, isValid);
        return isValid
        };
     
      const uiCanInteract = () => {
        const dataCcDigits = document.querySelector("div[data-cc-digits] > input");
        dataCcDigits.addEventListener("blur", detectCardType);
       
        const cardHolderName = document.querySelector("div[data-cc-info] > input");
        cardHolderName.addEventListener("blur", validateCardHolderName);
        const cardExpiryDate = document.querySelector("div[data-cc-info] input:nth-child(2)");
        cardExpiryDate.addEventListener("blur", validateCardExpiryDate);
        const payButton = document.querySelector("button[data-pay-btn]");
        payButton.addEventListener("click", validateCardNumber);
        const creditCardDigit = document.querySelector("[data-cc-digits] > input");
        creditCardDigit.focus();
      };
     
      const displayCartTotal = ({results}) => {
        const [data] = results;
        const {itemsInCart, buyerCountry} = data;
        appState.items = itemsInCart;
        appState.country = buyerCountry;
        appState.bill = itemsInCart.reduce((accumulator, currentValue) => {accumulator + currentValue.qty * currentValue.price, 0});
        appState.billFormatted = formatAsMoney(appState.bill, appState.country);
        const element = document.querySelector("span[data-bill]");
        element.textContent = appState.billFormatted;
        uiCanInteract();
      };
     
      const fetchBill = () => {
        const api = "https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c";
        fetch(api)
          .then(response => response.json())
          .then(data => displayCartTotal(data))
          .catch(error =>console.log(error));
      };
   
      const supportedCards = {
        visa,
        mastercard
      };
     
      const countries = [
        {
          code: "US",
          currency: "USD",
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          country: 'Ghana'
        }
      ];
     
      const startApp = () => {
        fetchBill();
      };

      startApp();
    </script>
  </body>
</html>