class Exchange{
    async getBase(base){
        const getData= await fetch(`https://api.exchangeratesapi.io/latest?base=${base}`);
        const responseData= await getData.json();
        return{
            responseData
        }
    }
}