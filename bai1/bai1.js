let amount = 500;
(async function()
{
    function useMoney(purpose, amountLoss, delay) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                console.log(purpose);
                amount = amount - amountLoss;
                res(amount);
            }, delay)
        })
    }
    await useMoney("Thịnh mua rau", 10, 1000);
    await useMoney("Thịnh mua cá", 100, 2000);
    await useMoney("Thịnh mua gà ", 120, 3000);
    await useMoney("Thịnh mua thịt lơn ", 70, 2000);
    console.log(`Số tiền còn lại là ${amount}`);
})();