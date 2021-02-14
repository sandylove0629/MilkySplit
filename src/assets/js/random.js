export const randomId = () => {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charactersLength = 6 // 設定長度
   for (let i = 0; i < charactersLength; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 62))
   }
   return result
}

export const randomNum = () => {
  let result = ""
  const characters = "0123456789"
  const charactersLength = 6 // 設定長度
   for (let i = 0; i < charactersLength; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 10))
   }
   return result
}