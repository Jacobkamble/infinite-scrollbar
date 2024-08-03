

export const generateURL=(limit:number,skip:number):string=>{

    console.log("skip",skip)

    return `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
}