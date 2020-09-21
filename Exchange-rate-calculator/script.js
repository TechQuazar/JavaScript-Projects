//INIT exchangeRate class
const exchange = new Exchange;
//Get elements
const amountOne=document.getElementById('amount-one');
const amountTwo=document.getElementById('amount-two');
const rate=document.getElementById('rate');
const swap=document.getElementById('swap');
const currencyOne=document.getElementById('currency-one');
const currencyTwo=document.getElementById('currency-two');
//add event listener
swap.addEventListener('click',swapRate);
amountOne.addEventListener('input',displayRate);
amountTwo.addEventListener('input',displayRate);
currencyOne.addEventListener('change',displayRate);
currencyTwo.addEventListener('change',displayRate);


//Display rate function
function displayRate(){
    const currency1=currencyOne.value;
    const currency2=currencyTwo.value;

    exchange.getBase(currency1).then(response=>{
        const currencyTwoValue=response.responseData.rates[currency2];
        rate.textContent=`1 ${currency1} = ${currencyTwoValue} ${currency2}`;
        amountTwo.value=(amountOne.value)*currencyTwoValue;

    })
}
//Swap rate Function
function swapRate(){
    const temp=currencyOne.value;
    currencyOne.value=currencyTwo.value;
    currencyTwo.value=temp;
    displayRate();
}
//calling the displayRate function
displayRate();